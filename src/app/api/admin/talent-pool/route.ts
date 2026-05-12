import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listTalentPool } from "@/db/queries/applications";

export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const search     = searchParams.get("search")     || undefined;
  const stage      = searchParams.get("stage")      || undefined;
  const department = searchParams.get("department") || undefined;
  const page       = parseInt(searchParams.get("page") ?? "1", 10);

  const result = await listTalentPool({ search, stage, department, page });
  return NextResponse.json(result);
}
