/**
 * seed-admin.ts — One-time script to create the first superadmin user.
 *
 * Usage:
 *   npm run seed:admin
 *
 * Required env vars (in .env.local):
 *   DATABASE_URL      — Neon PostgreSQL connection string
 *   SEED_ADMIN_NAME   — Full name, e.g. "Stanley Mashauri"
 *   SEED_ADMIN_EMAIL  — e.g. "stanley@chabrinagencies.co.ke"
 *   SEED_ADMIN_PASS   — Initial password (min 8 chars)
 *
 * After running, remove SEED_ADMIN_* from .env.local.
 * Additional users are created from /admin/users in the browser.
 */

import "dotenv/config";
import postgres from "postgres";
import { hash } from "bcryptjs";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const name  = process.env.SEED_ADMIN_NAME;
  const email = process.env.SEED_ADMIN_EMAIL;
  const pass  = process.env.SEED_ADMIN_PASS;

  if (!dbUrl)  { console.error("❌ DATABASE_URL not set"); process.exit(1); }
  if (!name)   { console.error("❌ SEED_ADMIN_NAME not set"); process.exit(1); }
  if (!email)  { console.error("❌ SEED_ADMIN_EMAIL not set"); process.exit(1); }
  if (!pass)   { console.error("❌ SEED_ADMIN_PASS not set"); process.exit(1); }
  if (pass.length < 8) { console.error("❌ SEED_ADMIN_PASS must be at least 8 characters"); process.exit(1); }

  const sql = postgres(dbUrl, { ssl: "require" });

  try {
    // Check if superadmin already exists
    const existing = await sql`
      SELECT id FROM admin_users WHERE role = 'superadmin' LIMIT 1
    `;
    if (existing.length > 0) {
      console.log("⚠️  A superadmin already exists. Skipping seed.");
      console.log("   To add more users, use /admin/users in the browser.");
      await sql.end();
      return;
    }

    const password_hash = await hash(pass, 12);

    const rows = await sql`
      INSERT INTO admin_users (name, email, password_hash, role)
      VALUES (${name.trim()}, ${email.toLowerCase().trim()}, ${password_hash}, 'superadmin')
      RETURNING id, name, email, role
    `;

    console.log("✅ Superadmin created:");
    console.log(`   Name:  ${rows[0].name}`);
    console.log(`   Email: ${rows[0].email}`);
    console.log(`   Role:  ${rows[0].role}`);
    console.log(`   ID:    ${rows[0].id}`);
    console.log("");
    console.log("👉 Remove SEED_ADMIN_* from .env.local");
    console.log("👉 Login at /admin-login with the email and password you set");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
