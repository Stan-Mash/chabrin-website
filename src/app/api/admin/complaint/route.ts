import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminComplaint } from "@/db/queries/admin-complaints";

export async function GET(req: NextRequest) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref || !/^CMP-\d{4}-[A-Z0-9]{5}$/.test(ref.toUpperCase())) {
    return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
  }

  const complaint = await getAdminComplaint(ref);
  if (!complaint) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(complaint);
}
