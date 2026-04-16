import { NextRequest, NextResponse } from "next/server";
import { getComplaintStatus } from "@/db/queries/complaints";

/**
 * GET /api/complaints/status?ref=CMP-2026-XXXXX
 *
 * Returns public-safe status fields only.
 * Never returns: full_name, email, phone, internal_notes.
 */
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")?.trim().toUpperCase();

  if (!ref || !/^CMP-\d{4}-[A-Z0-9]{5}$/.test(ref)) {
    return NextResponse.json(
      { error: "Invalid reference format. Expected CMP-YYYY-XXXXX" },
      { status: 400 }
    );
  }

  try {
    const complaint = await getComplaintStatus(ref);
    if (!complaint) {
      return NextResponse.json({ error: "Reference not found" }, { status: 404 });
    }
    return NextResponse.json(complaint, { status: 200 });
  } catch (err) {
    console.error("[complaints/status] db-error", {
      error: err instanceof Error ? err.message : "unknown",
      time:  new Date().toISOString(),
    });
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
  }
}
