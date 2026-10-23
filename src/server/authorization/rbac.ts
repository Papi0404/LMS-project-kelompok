import { AuthenticationError, AuthorizationError } from "@/lib/errors";
import { getCurrentProfile } from "@/server/auth/session";
import { Profile, UserRole } from "@/types/lms";

export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new AuthenticationError("Sesi Anda telah kedaluwarsa. Silakan masuk kembali.");
  }
  if (profile.status === "suspended") {
    throw new AuthorizationError("Akun Anda telah ditangguhkan. Silakan hubungi administrator.");
  }
  return profile;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<Profile> {
  const profile = await requireAuth();
  if (!allowedRoles.includes(profile.role)) {
    throw new AuthorizationError(
      `Peran '${profile.role}' tidak memiliki izin untuk mengakses sumber daya ini.`
    );
  }
  return profile;
}