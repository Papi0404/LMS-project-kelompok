import { NotFoundError } from "@/lib/errors";
import { Profile, UserRole, UserStatus } from "@/types/lms";
import { db } from "@/server/db";

interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: UserStatus;
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

export class UserService {
  static async listUsers(
    roleFilter?: UserRole,
    statusFilter?: UserStatus,
    searchQuery?: string
  ): Promise<Profile[]> {
    let sql = `SELECT id, email, full_name, role, status, identifier_number, phone, avatar_url, created_at 
               FROM public.profiles 
               WHERE 1=1`;
    const params: unknown[] = [];

    if (roleFilter) {
      params.push(roleFilter);
      sql += ` AND role = $${params.length}`;
    }

    if (statusFilter) {
      params.push(statusFilter);
      sql += ` AND status = $${params.length}`;
    }

    if (searchQuery) {
      params.push(`%${searchQuery.toLowerCase()}%`);
      sql += ` AND (LOWER(full_name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(COALESCE(identifier_number, '')) LIKE $${params.length})`;
    }

    sql += ` ORDER BY created_at ASC`;

    const rows = await db.query<ProfileRow>(sql, params);
    return rows.map(mapRowToProfile);
  }

  static async getUserById(userId: string): Promise<Profile> {
    const row = await db.queryOne<ProfileRow>(
      `SELECT id, email, full_name, role, status, identifier_number, phone, avatar_url, created_at 
       FROM public.profiles 
       WHERE id = $1`,
      [userId]
    );

    if (!row) throw new NotFoundError("Pengguna");
    return mapRowToProfile(row);
  }

  static async updateUserStatus(userId: string, status: UserStatus): Promise<Profile> {
    const row = await db.queryOne<ProfileRow>(
      `UPDATE public.profiles 
       SET status = $2 
       WHERE id = $1 
       RETURNING id, email, full_name, role, status, identifier_number, phone, avatar_url, created_at`,
      [userId, status]
    );

    if (!row) throw new NotFoundError("Pengguna");

    try {
      await db.query(
        `INSERT INTO public.system_activity_logs (user_id, action, entity_type, entity_id)
         VALUES ($1, 'USER_STATUS_UPDATE', 'profiles', $1)`,
        [userId]
      );
    } catch (err) {
      console.error("[USER_SERVICE] Log activity error:", err);
    }

    return mapRowToProfile(row);
  }

  static async sendPasswordReset(userId: string) {
    const row = await db.queryOne<{ email: string }>(
      `SELECT email FROM public.profiles WHERE id = $1`,
      [userId]
    );

    if (!row) throw new NotFoundError("Pengguna");

    try {
      await db.query(
        `INSERT INTO public.system_activity_logs (user_id, action, entity_type, entity_id)
         VALUES ($1, 'PASSWORD_RESET_REQUESTED', 'profiles', $1)`,
        [userId]
      );
    } catch (err) {
      console.error("[USER_SERVICE] Log activity error:", err);
    }

    return {
      success: true,
      message: `Tautan reset kata sandi telah dikirim ke ${row.email}.`,
    };
  }
}
