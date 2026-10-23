export type UserRole = "admin" | "teacher" | "student";
export type UserStatus = "active" | "pending" | "suspended";

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  identifierNumber?: string; // NIP / NISN
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ClassItem {
  id: string;
  name: string;
  gradeLevel: number;
  academicYear: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  teacherId: string;
  teacherName?: string;
  classId: string;
  className?: string;
  isActive: boolean;
  totalStudents?: number;
  completedPercentage?: number;
}

export interface ExamOption {
  id: string;
  text: string;
}

export interface ExamQuestionSafe {
  id: string;
  questionNumber: number;
  questionText: string;
  options: ExamOption[];
  points: number;
}

export interface ExamQuestionFull extends ExamQuestionSafe {
  correctOptionId: string;
}

export type AttemptStatus = "in_progress" | "submitted" | "abandoned" | "force_submitted";

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  startTime: string;
  endTime: string; // Server authoritative deadline
  submittedAt?: string;
  status: AttemptStatus;
  score?: number;
  totalCorrect?: number;
}

export interface ExamAnswer {
  questionId: string;
  selectedOptionId: string | null;
  isFlagged: boolean;
  answeredAt?: string;
}

export type AuditEventType = 
  | "tab_switch"
  | "fullscreen_exit"
  | "copy_paste_attempt"
  | "network_reconnect"
  | "idle_timeout"
  | "multiple_faces_detected";

export type AuditSeverity = "low" | "medium" | "high" | "critical";

export interface ExamAuditLog {
  id: string;
  attemptId: string;
  studentId: string;
  studentName?: string;
  eventType: AuditEventType;
  severity: AuditSeverity;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface LiveStudentSession {
  studentId: string;
  studentName: string;
  nisn: string;
  avatarUrl?: string;
  attemptId: string;
  status: AttemptStatus | "disconnected";
  currentQuestion: number;
  totalQuestions: number;
  answeredCount: number;
  remainingSeconds: number;
  anomalyCount: number;
  lastAnomalyType?: AuditEventType;
  lastActive: string;
}