-- ============================================================================
-- EduCore LMS Platform - Initial Database Schema & Security Policies
-- Migration: 001_initial_schema.sql
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Types / Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_status AS ENUM ('active', 'pending', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE attempt_status AS ENUM ('in_progress', 'submitted', 'abandoned', 'force_submitted');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_event_type AS ENUM (
        'tab_switch',
        'fullscreen_exit',
        'copy_paste_attempt',
        'network_reconnect',
        'idle_timeout',
        'multiple_faces_detected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    status user_status NOT NULL DEFAULT 'active',
    identifier_number TEXT UNIQUE, -- NIP for teachers, NISN for students
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- e.g. "Kelas 10 MIPA 1"
    grade_level INTEGER NOT NULL, -- 10, 11, 12
    academic_year TEXT NOT NULL, -- e.g. "2026/2027"
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE, -- e.g. "FIS-101"
    title TEXT NOT NULL, -- e.g. "Fisika Teori & Praktikum"
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- 5. Learning Materials Table
CREATE TABLE IF NOT EXISTS public.learning_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT, -- Storage path
    file_size_bytes BIGINT,
    mime_type TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    max_score NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_path TEXT,
    content_text TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    score NUMERIC(5,2),
    feedback TEXT,
    graded_by UUID REFERENCES public.profiles(id),
    graded_at TIMESTAMPTZ,
    UNIQUE(assignment_id, student_id)
);

-- 8. Exams (CBT) Table
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    start_window TIMESTAMPTZ NOT NULL,
    end_window TIMESTAMPTZ NOT NULL,
    passing_score NUMERIC(5,2) NOT NULL DEFAULT 75.00,
    randomize_questions BOOLEAN NOT NULL DEFAULT TRUE,
    randomize_options BOOLEAN NOT NULL DEFAULT TRUE,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Exam Questions Table
CREATE TABLE IF NOT EXISTS public.exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of objects: [{"id": "A", "text": "..."}, {"id": "B", "text": "..."}]
    correct_option_id TEXT NOT NULL, -- "A", "B", etc. NEVER exposed to students
    points NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Exam Attempts Table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ NOT NULL, -- Authoritative server-side deadline
    submitted_at TIMESTAMPTZ,
    status attempt_status NOT NULL DEFAULT 'in_progress',
    score NUMERIC(5,2),
    total_correct INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);

-- 11. Exam Answers Table
CREATE TABLE IF NOT EXISTS public.exam_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.exam_questions(id) ON DELETE CASCADE,
    selected_option_id TEXT,
    is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(attempt_id, question_id)
);

-- 12. Exam Audit Logs Table (Live Anti-Cheat Monitoring)
CREATE TABLE IF NOT EXISTS public.exam_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.exam_attempts(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type audit_event_type NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. System Activity Logs (Admin Audit Trail)
CREATE TABLE IF NOT EXISTS public.system_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check User Role
CREATE OR REPLACE FUNCTION public.get_auth_role(user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles Policies
CREATE POLICY "Profiles readable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own non-role profile fields"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id AND 
        role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Admins full management on profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.get_auth_role(auth.uid()) = 'admin');

-- Courses Policies
CREATE POLICY "Courses readable by enrolled students, teachers, and admins"
    ON public.courses FOR SELECT
    TO authenticated
    USING (
        public.get_auth_role(auth.uid()) = 'admin' OR
        teacher_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.enrollments 
            WHERE enrollments.course_id = courses.id 
            AND enrollments.student_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can manage their own courses"
    ON public.courses FOR ALL
    TO authenticated
    USING (teacher_id = auth.uid() OR public.get_auth_role(auth.uid()) = 'admin');

-- Exams Policies
CREATE POLICY "Exams readable by authorized users"
    ON public.exams FOR SELECT
    TO authenticated
    USING (
        public.get_auth_role(auth.uid()) = 'admin' OR
        created_by = auth.uid() OR
        (
            is_published = TRUE AND
            EXISTS (
                SELECT 1 FROM public.enrollments 
                WHERE enrollments.course_id = exams.course_id 
                AND enrollments.student_id = auth.uid()
            )
        )
    );

-- Exam Attempts Policies
CREATE POLICY "Students can read and start their own attempts"
    ON public.exam_attempts FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid() OR
        public.get_auth_role(auth.uid()) IN ('admin', 'teacher')
    );

CREATE POLICY "Students insert own attempts"
    ON public.exam_attempts FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own in_progress attempts"
    ON public.exam_attempts FOR UPDATE
    TO authenticated
    USING (student_id = auth.uid() AND status = 'in_progress')
    WITH CHECK (student_id = auth.uid());

-- Exam Answers Policies
CREATE POLICY "Students manage own answers for in_progress attempts"
    ON public.exam_answers FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.exam_attempts
            WHERE exam_attempts.id = exam_answers.attempt_id
            AND exam_attempts.student_id = auth.uid()
            AND exam_attempts.status = 'in_progress'
        )
    );

CREATE POLICY "Teachers read answers of students in their exams"
    ON public.exam_answers FOR SELECT
    TO authenticated
    USING (public.get_auth_role(auth.uid()) IN ('admin', 'teacher'));

-- Exam Audit Logs Policies
CREATE POLICY "Audit logs insertable by exam taker"
    ON public.exam_audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Audit logs readable by teachers and admins"
    ON public.exam_audit_logs FOR SELECT
    TO authenticated
    USING (public.get_auth_role(auth.uid()) IN ('admin', 'teacher'));