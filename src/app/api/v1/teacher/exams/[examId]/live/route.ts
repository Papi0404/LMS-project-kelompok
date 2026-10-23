import { NextResponse } from "next/server";
import { requireRole } from "@/server/authorization/rbac";
import { ExamService } from "@/server/services/exam.service";
import { handleApiError } from "@/lib/errors";

export async function GET(
  request: Request,
  props: { params: Promise<{ examId: string }> }
) {
  try {
    await requireRole(["teacher", "admin"]);
    const { examId } = await props.params;
    const url = new URL(request.url);
    const monitoring = await ExamService.getLiveExamMonitoring();
    return NextResponse.json({ success: true, examId, pathname: url.pathname, data: monitoring });
  } catch (err) {
    return handleApiError(err);
  }
}
