import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDbUrl = !!process.env.DATABASE_URL;
  
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    server: "running",
    databaseConfigured: hasDbUrl,
  });
}
