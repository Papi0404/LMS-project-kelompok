import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/server/authorization/rbac";
import { UserService } from "@/server/services/user.service";
import { handleApiError } from "@/lib/errors";
import { updateUserStatusSchema } from "@/features/users/schemas/user.schema";
import { UserRole, UserStatus } from "@/types/lms";

export async function GET(request: NextRequest) {
  try {
    await requireRole(["admin"]);
    const { searchParams } = new URL(request.url);
    const role = (searchParams.get("role") as UserRole) || undefined;
    const status = (searchParams.get("status") as UserStatus) || undefined;
    const search = searchParams.get("q") || undefined;

    const users = await UserService.listUsers(role, status, search);
    return NextResponse.json({ success: true, data: users });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireRole(["admin"]);
    const body = await request.json();
    const { userId, action, status } = body;

    if (action === "reset_password") {
      const res = await UserService.sendPasswordReset(userId);
      return NextResponse.json(res);
    }

    const validated = updateUserStatusSchema.parse({ status });
    const updated = await UserService.updateUserStatus(userId, validated.status);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return handleApiError(err);
  }
}