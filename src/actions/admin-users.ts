"use server";

/**
 * admin-users.ts — Server Actions for admin user management.
 * All actions require superadmin role except changeOwnPassword.
 */

import { redirect } from "next/navigation";
import { hash, compare } from "bcryptjs";
import {
  getAdminSession,
  isLockedOut,
  recordFailedAttempt,
  clearFailedAttempts,
  remainingAttempts,
  ADMIN_COOKIE,
} from "@/lib/admin-auth";
import {
  createAdminUser,
  updateAdminUserPassword,
  setAdminUserActive,
  createAdminSession,
  deleteAdminSession,
  findAdminUserByEmail,
  findAdminUserById,
  touchLastLogin,
  type AdminRole,
} from "@/db/queries/admin-users";
import { cookies, headers } from "next/headers";

const BCRYPT_ROUNDS = 12;
const SESSION_HOURS = 12;

// ── Login ─────────────────────────────────────────────────────────────────────

export async function adminLogin(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string }> {
  const hdrs = await headers();
  const ip   = hdrs.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isLockedOut(ip)) {
    await new Promise((r) => setTimeout(r, 400));
    return { error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const email    = (formData.get("email")    as string)?.toLowerCase().trim();
  const password = (formData.get("password") as string) ?? "";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await findAdminUserByEmail(email);

  // Always run bcrypt even if user not found (prevent timing oracle)
  // Valid bcrypt hash of "dummy" — only used when user is not found
  const dummyHash = "$2a$12$LN9a2V5jbOVDMHHMgq6MG.pCVPNJIJqPNqZ2sI7Gn5LRhHLEsfIhK";
  const passwordMatch = await compare(
    password,
    user?.password_hash ?? dummyHash
  ).catch(() => false);

  if (!user || !passwordMatch || !user.is_active) {
    await new Promise((r) => setTimeout(r, 400));
    const locked = recordFailedAttempt(ip);
    if (locked) {
      return { error: "Too many failed attempts. Try again in 15 minutes." };
    }
    const left = remainingAttempts(ip);
    return { error: `Incorrect email or password. ${left} attempt${left === 1 ? "" : "s"} remaining.` };
  }

  clearFailedAttempts(ip);
  await touchLastLogin(user.id);

  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  const sessionId = await createAdminSession(user.id, expiresAt);

  const jar = await cookies();
  jar.set(ADMIN_COOKIE, sessionId, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "strict",
    path:     "/",
    maxAge:   SESSION_HOURS * 60 * 60,
  });

  redirect("/admin");
}

// ── Logout ────────────────────────────────────────────────────────────────────

export async function adminLogout(): Promise<void> {
  const jar       = await cookies();
  const sessionId = jar.get(ADMIN_COOKIE)?.value;
  if (sessionId) await deleteAdminSession(sessionId);
  jar.delete(ADMIN_COOKIE);
  redirect("/admin-login");
}

// ── Create user (superadmin only) ─────────────────────────────────────────────

export async function adminCreateUser(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const me = await getAdminSession();
  if (!me || me.role !== "superadmin") redirect("/admin");

  const name     = (formData.get("name")     as string)?.trim();
  const email    = (formData.get("email")    as string)?.toLowerCase().trim();
  const password = (formData.get("password") as string) ?? "";
  const role     = (formData.get("role")     as string)?.trim() as AdminRole;

  if (!name || !email || !password || !role) {
    return { error: "All fields are required." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!["staff", "superadmin"].includes(role)) {
    return { error: "Invalid role." };
  }

  try {
    const password_hash = await hash(password, BCRYPT_ROUNDS);
    await createAdminUser({ name, email, password_hash, role });
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create user.";
    if (msg.includes("unique") || msg.includes("email")) {
      return { error: "A user with this email already exists." };
    }
    return { error: msg };
  }
}

// ── Deactivate / reactivate user (superadmin only) ───────────────────────────

export async function adminSetUserActive(
  formData: FormData
): Promise<void> {
  const me = await getAdminSession();
  if (!me || me.role !== "superadmin") redirect("/admin");

  const id        = (formData.get("id")        as string)?.trim();
  const is_active = formData.get("is_active") === "true";

  if (!id) return;

  // Prevent superadmin from deactivating themselves
  if (id === me.id && !is_active) return;

  try {
    await setAdminUserActive(id, is_active);
  } catch { /* non-critical — page reloads anyway */ }

  redirect("/admin/users");
}

// ── Change own password ───────────────────────────────────────────────────────

export async function changeOwnPassword(
  _prev: unknown,
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  const me = await getAdminSession();
  if (!me) redirect("/admin-login");

  const current     = (formData.get("current_password") as string) ?? "";
  const next        = (formData.get("new_password")     as string) ?? "";
  const confirm     = (formData.get("confirm_password") as string) ?? "";

  if (!current || !next || !confirm) return { error: "All fields are required." };
  if (next.length < 8)              return { error: "New password must be at least 8 characters." };
  if (next !== confirm)             return { error: "New passwords do not match." };

  // Re-fetch with password_hash
  const { findAdminUserByEmail: byEmail } = await import("@/db/queries/admin-users");
  const user = await byEmail(me.email);
  if (!user) return { error: "User not found." };

  const ok = await compare(current, user.password_hash);
  if (!ok) return { error: "Current password is incorrect." };

  const password_hash = await hash(next, BCRYPT_ROUNDS);
  await updateAdminUserPassword(me.id, password_hash);
  return { success: true };
}

// ── Superadmin reset another user's password ─────────────────────────────────

export async function adminResetUserPassword(
  formData: FormData
): Promise<void> {
  const me = await getAdminSession();
  if (!me || me.role !== "superadmin") redirect("/admin");

  const id       = (formData.get("id")           as string)?.trim();
  const password = (formData.get("new_password") as string) ?? "";

  if (!id || !password || password.length < 8) return;

  const target = await findAdminUserById(id);
  if (!target) return;

  const password_hash = await hash(password, BCRYPT_ROUNDS);
  await updateAdminUserPassword(id, password_hash);
  redirect("/admin/users");
}
