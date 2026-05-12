import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAdminApplication, getAppEvents } from "@/db/queries/applications";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) {
    return NextResponse.json({ error: "ref is required" }, { status: 400 });
  }

  const app = await getAdminApplication(ref);
  if (!app) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const events = await getAppEvents(app.id);
  return NextResponse.json(events);
}
