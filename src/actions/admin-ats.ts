"use server";

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  updateApplicationStage,
  logAppEvent,
  getAdminApplication,
  type AppStage,
} from "@/db/queries/applications";
import { insertJob, updateJob, type NewJob } from "@/db/queries/jobs";
import { sendStageChangeEmail } from "@/actions/submit-application";

// ── Update application stage ──────────────────────────────────────────────────

export async function adminUpdateApplication(
  _prev: Record<string, unknown>,
  formData: FormData
): Promise<Record<string, unknown>> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const reference       = (formData.get("reference")       as string | null)?.trim() ?? "";
  const stage           = (formData.get("stage")           as string | null)?.trim() ?? "";
  const internal_notes  = (formData.get("internal_notes")  as string | null)?.trim() || null;
  const stage_note      = (formData.get("stage_note")      as string | null)?.trim() || null;

  if (!reference || !stage) return { error: "Reference and stage are required." };

  const app = await getAdminApplication(reference);
  if (!app) return { error: "Application not found." };

  const prevStage = app.stage;

  try {
    await updateApplicationStage(reference, stage as AppStage, null, internal_notes);
    await logAppEvent(app.id, prevStage, stage, "admin", stage_note);

    // Send email to candidate if stage changed
    if (prevStage !== stage) {
      await sendStageChangeEmail(
        app.email, app.full_name, reference, app.job_title, stage, stage_note
      );
    }

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
}

// ── Create job ────────────────────────────────────────────────────────────────

export async function adminCreateJob(
  _prev: Record<string, unknown>,
  formData: FormData
): Promise<Record<string, unknown>> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const title       = (formData.get("title")       as string)?.trim();
  const department  = (formData.get("department")  as string)?.trim();
  const job_type    = (formData.get("job_type")    as string)?.trim() || "Full-time";
  const location    = (formData.get("location")    as string)?.trim() || "Nairobi (On-site)";
  const summary     = (formData.get("summary")     as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const salary_range= (formData.get("salary_range") as string)?.trim() || null;
  const status      = (formData.get("status")      as string)?.trim() || "draft";
  const closes_at   = (formData.get("closes_at")   as string)?.trim() || null;

  // Requirements: newline-separated
  const requirements_raw = (formData.get("requirements") as string)?.trim() ?? "";
  const requirements = requirements_raw.split("\n").map(s => s.trim()).filter(Boolean);

  const nice_to_have_raw = (formData.get("nice_to_have") as string)?.trim() ?? "";
  const nice_to_have = nice_to_have_raw.split("\n").map(s => s.trim()).filter(Boolean);

  if (!title || !department || !summary || !description) {
    return { error: "Title, department, summary and description are required." };
  }

  // Auto-generate slug from title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    const id = await insertJob({
      slug, title, department, job_type, location, summary, description,
      requirements, nice_to_have, salary_range,
      screening_questions: [],
      status: status as NewJob["status"],
      closes_at: closes_at ? new Date(closes_at) : null,
    });
    return { success: true, id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to create job.";
    if (msg.includes("unique") || msg.includes("slug")) {
      return { error: "A job with this title already exists. Please use a different title." };
    }
    return { error: msg };
  }
}

// ── Update job ────────────────────────────────────────────────────────────────

export async function adminUpdateJob(
  _prev: Record<string, unknown>,
  formData: FormData
): Promise<Record<string, unknown>> {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  const id          = (formData.get("id")          as string)?.trim();
  const title       = (formData.get("title")       as string)?.trim();
  const department  = (formData.get("department")  as string)?.trim();
  const job_type    = (formData.get("job_type")    as string)?.trim();
  const location    = (formData.get("location")    as string)?.trim();
  const summary     = (formData.get("summary")     as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const salary_range= (formData.get("salary_range") as string)?.trim() || null;
  const status      = (formData.get("status")      as string)?.trim();
  const closes_at   = (formData.get("closes_at")   as string)?.trim() || null;

  const requirements_raw = (formData.get("requirements") as string)?.trim() ?? "";
  const requirements = requirements_raw.split("\n").map(s => s.trim()).filter(Boolean);
  const nice_to_have_raw = (formData.get("nice_to_have") as string)?.trim() ?? "";
  const nice_to_have = nice_to_have_raw.split("\n").map(s => s.trim()).filter(Boolean);

  if (!id) return { error: "Job ID is required." };

  try {
    await updateJob(id, {
      title, department, job_type, location, summary, description,
      requirements, nice_to_have, salary_range,
      status: status as NewJob["status"],
      closes_at: closes_at ? new Date(closes_at) : null,
    });
    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed." };
  }
}
