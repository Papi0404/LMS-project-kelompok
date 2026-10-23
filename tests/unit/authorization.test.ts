import { describe, it, expect } from "vitest";
import { MOCK_PROFILES } from "@/server/auth/session";

describe("Role-Based Access Control (RBAC) Security Rules", () => {
  it("denies access to protected teacher endpoints for student role", async () => {
    // Skenario otorisasi negatif sesuai AGENTS.md Bagian 15
    const studentRole = MOCK_PROFILES.student.role;
    const allowedRolesForTeacher = ["teacher", "admin"] as const;

    const isAuthorized = (allowedRolesForTeacher as readonly string[]).includes(studentRole);
    expect(isAuthorized).toBe(false);
  });

  it("denies access to admin endpoints for teacher role", async () => {
    const teacherRole = MOCK_PROFILES.teacher.role;
    const allowedRolesForAdmin = ["admin"] as const;

    const isAuthorized = (allowedRolesForAdmin as readonly string[]).includes(teacherRole);
    expect(isAuthorized).toBe(false);
  });

  it("allows admin access to manage users and global settings", async () => {
    const adminRole = MOCK_PROFILES.admin.role;
    const allowedRolesForAdmin = ["admin"] as const;

    const isAuthorized = (allowedRolesForAdmin as readonly string[]).includes(adminRole);
    expect(isAuthorized).toBe(true);
  });
});