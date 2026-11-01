import { NextRequest, NextResponse } from "next/server";
import { databaseReady, dbRequest } from "@/lib/supabase";
import { createHash, randomUUID } from "crypto";

export const runtime = "nodejs";

export async function GET() {
  if (!databaseReady()) return NextResponse.json({ configured: false, count: null }, { status: 503 });
  try {
    const rows = await dbRequest<{ total: number }[]>("celebration_totals?select=total&limit=1");
    return NextResponse.json({ configured: true, count: rows[0]?.total ?? 0 });
  } catch {
    return NextResponse.json({ configured: false, count: null }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  if (!databaseReady()) return NextResponse.json({ error: "Celebrations are temporarily unavailable." }, { status: 503 });
  try {
    let visitor = request.cookies.get("green_diwali_visitor")?.value;
    const isNew = !visitor || !/^[0-9a-f-]{36}$/i.test(visitor);
    if (isNew) visitor = randomUUID();
    const visitorHash = createHash("sha256").update(visitor!).digest("hex");
    await dbRequest("rpc/record_celebration", { method: "POST", body: JSON.stringify({ visitor_hash: visitorHash }) });
    const rows = await dbRequest<{ total: number }[]>("celebration_totals?select=total&limit=1");
    const response = NextResponse.json({ count: rows[0]?.total ?? 0 });
    if (isNew) response.cookies.set("green_diwali_visitor", visitor!, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  } catch {
    return NextResponse.json({ error: "We couldn't record that celebration. Please try again." }, { status: 503 });
  }
}
