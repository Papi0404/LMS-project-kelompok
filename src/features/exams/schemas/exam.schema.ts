import { z } from "zod";

export const saveAnswerSchema = z.object({
  attemptId: z.string().uuid("ID Attempt tidak valid"),
  questionId: z.string().uuid("ID Soal tidak valid"),
  selectedOptionId: z.string().nullable(),
  isFlagged: z.boolean().default(false),
});

export const submitExamSchema = z.object({
  attemptId: z.string().uuid("ID Attempt tidak valid"),
});

export const logAuditEventSchema = z.object({
  attemptId: z.string().uuid("ID Attempt tidak valid"),
  eventType: z.enum([
    "tab_switch",
    "fullscreen_exit",
    "copy_paste_attempt",
    "network_reconnect",
    "idle_timeout",
    "multiple_faces_detected",
  ]),
  severity: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const liveExamActionSchema = z.object({
  studentId: z.string().uuid("ID Siswa tidak valid"),
  action: z.enum(["warning", "force_submit", "reset_session"]),
  message: z.string().optional(),
});

export type SaveAnswerInput = z.infer<typeof saveAnswerSchema>;
export type SubmitExamInput = z.infer<typeof submitExamSchema>;
export type LogAuditEventInput = z.infer<typeof logAuditEventSchema>;
export type LiveExamActionInput = z.infer<typeof liveExamActionSchema>;