/**
 * admin-users.ts — DB query functions for admin user management.
 * Server-side only.
 */

import { sql } from "@/lib/db";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AdminRole = "staff" | "superadmin";

export interface AdminUser {
  id:            string;
  name:          string;
  email:         string;
  password_hash: string;
  role:          AdminRole;
  is_active:     boolean;
  last_login_at: Date | null;
  created_at:    Date;
  updated_at:    Date;
}

export type AdminUserPublic = Omit<AdminUser, "password_hash">;

export interface AdminSession {
  id:         string;
  user_id:    string;
  expires_at: Date;
  created_at: Date;
}

// ── User queries ──────────────────────────────────────────────────────────────

export async function findAdminUserByEmail(
  email: string
): Promise<AdminUser | null> {
  const rows = await sql<AdminUser[]>`
    SELECT * FROM admin_users
    WHERE email = ${email.toLowerCase().trim()} AND is_active = true
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function findAdminUserById(
  id: string
): Promise<AdminUserPublic | null> {
  const rows = await sql<AdminUserPublic[]>`
    SELECT id, name, email, role, is_active, last_login_at, created_at, updated_at
    FROM admin_users
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function listAdminUsers(): Promise<AdminUserPublic[]> {
  return sql<AdminUserPublic[]>`
    SELECT id, name, email, role, is_active, last_login_at, created_at, updated_at
    FROM admin_users
    ORDER BY created_at ASC
  `;
}

export async function createAdminUser(user: {
  name:          string;
  email:         string;
  password_hash: string;
  role:          AdminRole;
}): Promise<string> {
  const rows = await sql<{ id: string }[]>`
    INSERT INTO admin_users (name, email, password_hash, role)
    VALUES (
      ${user.name.trim()},
      ${user.email.toLowerCase().trim()},
      ${user.password_hash},
      ${user.role}
    )
    RETURNING id
  `;
  return rows[0].id;
}

export async function updateAdminUserPassword(
  id:            string,
  password_hash: string
): Promise<void> {
  await sql`
    UPDATE admin_users SET password_hash = ${password_hash}
    WHERE id = ${id}
  `;
}

export async function setAdminUserActive(
  id:        string,
  is_active: boolean
): Promise<void> {
  await sql`
    UPDATE admin_users SET is_active = ${is_active} WHERE id = ${id}
  `;
}

export async function touchLastLogin(id: string): Promise<void> {
  await sql`
    UPDATE admin_users SET last_login_at = NOW() WHERE id = ${id}
  `;
}

// ── Session queries ───────────────────────────────────────────────────────────

export async function createAdminSession(
  user_id:    string,
  expires_at: Date
): Promise<string> {
  const rows = await sql<{ id: string }[]>`
    INSERT INTO admin_sessions (user_id, expires_at)
    VALUES (${user_id}, ${expires_at})
    RETURNING id
  `;
  return rows[0].id;
}

export async function findAdminSession(
  session_id: string
): Promise<(AdminSession & { user_id: string }) | null> {
  const rows = await sql<AdminSession[]>`
    SELECT * FROM admin_sessions
    WHERE id = ${session_id} AND expires_at > NOW()
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function deleteAdminSession(session_id: string): Promise<void> {
  await sql`DELETE FROM admin_sessions WHERE id = ${session_id}`;
}

export async function deleteAllUserSessions(user_id: string): Promise<void> {
  await sql`DELETE FROM admin_sessions WHERE user_id = ${user_id}`;
}

/** Clean up expired sessions (call periodically) */
export async function purgeExpiredSessions(): Promise<void> {
  await sql`DELETE FROM admin_sessions WHERE expires_at <= NOW()`;
}

export async function adminUserCount(): Promise<number> {
  const rows = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM admin_users
  `;
  return parseInt(rows[0]?.count ?? "0", 10);
}
