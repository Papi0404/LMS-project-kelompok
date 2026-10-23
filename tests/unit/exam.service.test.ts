import { describe, it, expect } from "vitest";
import { ExamService, cbtStore } from "@/server/services/exam.service";

describe("CBT Exam Service Security & Business Rules", () => {
  const studentId = "33333333-3333-3333-3333-333333333333";
  const examId = cbtStore.exam.id;

  it("never exposes answer keys or correctOptionId to student", async () => {
    const session = await ExamService.getStudentExamSession(examId, studentId);
    expect(session.questions.length).toBeGreaterThan(0);
    
    // Check that every question in session has NO correctOptionId
    session.questions.forEach((q) => {
      expect((q as unknown as Record<string, unknown>).correctOptionId).toBeUndefined();
      expect(q.options.length).toBeGreaterThan(0);
      expect(q.questionText).toBeDefined();
    });
  });

  it("calculates exam scores strictly on the server-side", async () => {
    const session = await ExamService.getStudentExamSession(examId, studentId);
    const attemptId = session.attempt.id;

    // Answer Q1 with correct option ('B')
    await ExamService.saveAnswer(attemptId, studentId, "q1111111-1111-1111-1111-111111111111", "B", false);
    // Answer Q2 with correct option ('C')
    await ExamService.saveAnswer(attemptId, studentId, "q2222222-2222-2222-2222-222222222222", "C", false);

    const submitResult = await ExamService.submitAttempt(attemptId, studentId);
    expect(submitResult.score).toBeGreaterThanOrEqual(50);
    expect(submitResult.totalCorrect).toBeGreaterThanOrEqual(2);
  });

  it("rejects answer updates when student attempt is expired", async () => {
    const session = await ExamService.getStudentExamSession(examId, studentId);
    const attemptId = session.attempt.id;
    const attempt = cbtStore.attempts.get(studentId)!;

    // Simulate time expiration
    attempt.status = "in_progress"; attempt.endTime = Date.now() - 1000;

    await expect(
      ExamService.saveAnswer(attemptId, studentId, "q1111111-1111-1111-1111-111111111111", "B", false)
    ).rejects.toThrow("Waktu ujian telah habis");
  });

  it("records anti-cheat anomalies in live audit log", async () => {
    const session = await ExamService.getStudentExamSession(examId, studentId);
    const attemptId = session.attempt.id;

    await ExamService.recordAnomaly(attemptId, studentId, "tab_switch", "high", { duration: 15 });
    const attempt = cbtStore.attempts.get(studentId)!;
    
    expect(attempt.anomalies.some((a) => a.type === "tab_switch")).toBe(true);
  });
});