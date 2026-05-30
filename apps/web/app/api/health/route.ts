import { NextResponse } from "next/server";

export async function GET() {
  const hasDbUrl = !!process.env.DATABASE_URL;
  
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    server: "running",
    databaseConfigured: hasDbUrl,
  });
}
