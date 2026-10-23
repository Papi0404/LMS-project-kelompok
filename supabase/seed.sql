-- ============================================================================
-- EduCore LMS Platform - Development Seed Data
-- ============================================================================

-- Dummy UUIDs for consistent references
-- Admin: 11111111-1111-1111-1111-111111111111
-- Teacher: 22222222-2222-2222-2222-222222222222
-- Student 1 (Rizky): 33333333-3333-3333-3333-333333333333
-- Student 2 (Fajar): 44444444-4444-4444-4444-444444444444
-- Student 3 (Siti): 55555555-5555-5555-5555-555555555555

-- Profiles
INSERT INTO public.profiles (id, email, full_name, role, status, identifier_number, phone, avatar_url)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'admin@educore.ac.id', 'Dr. Hendra Gunawan, M.Kom', 'admin', 'active', '198204152008011002', '+6281122334455', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'),
    ('22222222-2222-2222-2222-222222222222', 'guru.nurul@educore.ac.id', 'Dra. Nurul Hidayati, M.Pd', 'teacher', 'active', '197805122005012004', '+6281234567890', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'),
    ('33333333-3333-3333-3333-333333333333', 'rizky.pratama@siswa.educore.ac.id', 'Muhammad Rizky Pratama', 'student', 'active', '0078912345', '+6289876543210', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'),
    ('44444444-4444-4444-4444-444444444444', 'fajar.nugraha@siswa.educore.ac.id', 'Fajar Nugraha', 'student', 'active', '0078912346', '+6289876543211', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'),
    ('55555555-5555-5555-5555-555555555555', 'siti.aisyah@siswa.educore.ac.id', 'Siti Aisyah Putri', 'student', 'active', '0078912347', '+6289876543212', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- Classes
INSERT INTO public.classes (id, name, grade_level, academic_year)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'Kelas 10 MIPA 1', 10, '2026/2027'),
    ('c2222222-2222-2222-2222-222222222222', 'Kelas 11 MIPA 2', 11, '2026/2027')
ON CONFLICT (id) DO NOTHING;

-- Courses
INSERT INTO public.courses (id, code, title, description, teacher_id, class_id, is_active)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'FIS-101', 'Fisika Teori & Praktikum', 'Mekanika Klasik, Kinematika, Dinamika Newton, dan Fluida', '22222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', true),
    ('a2222222-2222-2222-2222-222222222222', 'FIS-201', 'Fisika Modern & Kuantum', 'Relativitas Khusus, Dualisme Gelombang Partikel, dan Struktur Atom', '22222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', true)
ON CONFLICT (id) DO NOTHING;

-- Enrollments
INSERT INTO public.enrollments (student_id, course_id)
VALUES
    ('33333333-3333-3333-3333-333333333333', 'a1111111-1111-1111-1111-111111111111'),
    ('44444444-4444-4444-4444-444444444444', 'a1111111-1111-1111-1111-111111111111'),
    ('55555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111')
ON CONFLICT (student_id, course_id) DO NOTHING;

-- Exam (CBT)
INSERT INTO public.exams (id, course_id, title, description, duration_minutes, start_window, end_window, passing_score, is_published, created_by)
VALUES
    ('e1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Ujian CBT: Penilaian Tengah Semester Fisika Terpadu', 'Materi Kinematika Gerak Lurus dan Hukum Newton', 90, NOW() - INTERVAL '1 hour', NOW() + INTERVAL '24 hours', 75.00, true, '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- Exam Questions
INSERT INTO public.exam_questions (id, exam_id, question_number, question_text, options, correct_option_id, points)
VALUES
    ('b1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 1, 'Sebuah balok bermassa 5 kg ditarik dengan gaya konstan 25 N mendatar di atas lantai licin tanpa gesekan. Jika kecepatan awal balok adalah nol, berapakah percepatan balok tersebut?', '[{"id":"A","text":"2 m/s²"},{"id":"B","text":"5 m/s²"},{"id":"C","text":"10 m/s²"},{"id":"D","text":"12.5 m/s²"},{"id":"E","text":"20 m/s²"}]'::jsonb, 'B', 10.00),
    ('b2222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 2, 'Benda dilemparkan vertikal ke atas dengan kecepatan 20 m/s dari permukaan tanah. Jika g = 10 m/s², tinggi maksimum yang dicapai benda adalah...', '[{"id":"A","text":"10 meter"},{"id":"B","text":"15 meter"},{"id":"C","text":"20 meter"},{"id":"D","text":"25 meter"},{"id":"E","text":"40 meter"}]'::jsonb, 'C', 10.00),
    ('b3333333-3333-3333-3333-333333333333', 'e1111111-1111-1111-1111-111111111111', 3, 'Hukum I Newton menyatakan bahwa setiap benda akan tetap diam atau bergerak lurus beraturan jika...', '[{"id":"A","text":"Gaya gravitasi diabaikan"},{"id":"B","text":"Resultan gaya yang bekerja pada benda sama dengan nol"},{"id":"C","text":"Benda berada di ruang hampa"},{"id":"D","text":"Kecepatan benda selalu bertambah"},{"id":"E","text":"Benda tidak memiliki massa"}]'::jsonb, 'B', 10.00)
ON CONFLICT (id) DO NOTHING;