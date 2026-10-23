import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/authorization/rbac";
import { ExamService } from "@/server/services/exam.service";
import { handleApiError } from "@/lib/errors";
import { liveExamActionSchema } from "@/features/exams/schemas/exam.schema";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await props.params;
    if (!examId) return NextResponse.json({ error: "Missing examId" }, { status: 400 });
    await requireRole(["teacher", "admin"]);
    const body = await request.json();
    const validated = liveExamActionSchema.parse(body);

    const res = await ExamService.handleTeacherAction(
      validated.studentId,
      validated.action,
      validated.message
    );
    return NextResponse.json(res);
  } catch (err) {
    return handleApiError(err);
  }
}