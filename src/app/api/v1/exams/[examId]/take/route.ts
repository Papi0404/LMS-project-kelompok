import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/authorization/rbac";
import { ExamService } from "@/server/services/exam.service";
import { handleApiError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const user = await requireRole(["student"]);
    const { examId } = await params;
    const session = await ExamService.getStudentExamSession(examId, user.id);
    return NextResponse.json({ success: true, data: session });
  } catch (err) {
    return handleApiError(err);
  }
}