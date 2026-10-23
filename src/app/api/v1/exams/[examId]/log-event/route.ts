import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/authorization/rbac";
import { ExamService } from "@/server/services/exam.service";
import { handleApiError } from "@/lib/errors";
import { logAuditEventSchema } from "@/features/exams/schemas/exam.schema";

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ examId: string }> }
) {
  try {
    const { examId } = await props.params;
    if (!examId) return NextResponse.json({ error: "Missing examId" }, { status: 400 });
    const user = await requireRole(["student"]);
    const body = await request.json();
    const validated = logAuditEventSchema.parse(body);

    const res = await ExamService.recordAnomaly(
      validated.attemptId,
      user.id,
      validated.eventType,
      validated.severity,
      validated.metadata
    );
    return NextResponse.json(res);
  } catch (err) {
    return handleApiError(err);
  }
}