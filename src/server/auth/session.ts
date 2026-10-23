import { createClient } from "@/lib/supabase/server";
import { Profile, UserRole } from "@/types/lms";
import { cookies } from "next/headers";
import { db } from "@/server/db";

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: "active" | "pending" | "suspended";
  identifier_number: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
}

function mapRowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    status: row.status,
    identifierNumber: row.identifier_number || undefined,
    phone: row.phone || undefined,
    avatarUrl: row.avatar_url || undefined,
    createdAt: row.created_at,
  };
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const cookieStore = await cookies();
  const demoRoleCookie = cookieStore.get("educore_active_role")?.value as UserRole | undefined;

  // 1. If a role switcher cookie is set, fetch the corresponding real user profile from the database
  if (demoRoleCookie) {
    try {
      const row = await db.queryOne<ProfileRow>(
        `SELECT id, email, full_name, role, status, identifier_number, phone, avatar_url, created_at 
         FROM public.profiles 
         WHERE role = $1 AND status = 'active'
         ORDER BY created_at ASC 
         LIMIT 1`,
        [demoRoleCookie]
      );
      if (row) return mapRowToProfile(row);
    } catch (err) {
      console.error("[AUTH] Error loading profile from DB:", err);
    }
  }

  // 2. Otherwise verify via Supabase Auth session if configured
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const row = await db.queryOne<ProfileRow>(
        `SELECT id, email, full_name, role, status, identifier_number, phone, avatar_url, created_at 
         FROM public.profiles 
         WHERE id = $1`,
        [user.id]
      );
      if (row) return mapRowToProfile(row);
    }
  } catch {
    // Supabase auth client unavailable in local dev, fallback to first real admin profile
  }

  // 3. Fallback: load the first admin from real database
  try {
    const defaultRow = await db.queryOne<ProfileRow>(
      `SELECT id, email, full_name, role, status, identifier_number, phone, avatar_url, created_at 
       FROM public.profiles 
       ORDER BY created_at ASC 
       LIMIT 1`
    );
    if (defaultRow) return mapRowToProfile(defaultRow);
  } catch (err) {
    console.error("[AUTH] Failed to fetch fallback profile from DB:", err);
  }

  return null;
}
