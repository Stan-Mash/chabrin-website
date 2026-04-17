import { NextRequest, NextResponse } from "next/server";
import { getApplicationStatus } from "@/db/queries/applications";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref || !/^APP-[A-Z]{3}-\d{4}-[A-Z0-9]{5}$/.test(ref.toUpperCase())) {
    return NextResponse.json({ error: "Invalid reference format" }, { status: 400 });
  }

  const status = await getApplicationStatus(ref);
  if (!status) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  return NextResponse.json(status);
}
