import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();
  
  try {
    const { prisma } = await import("@/lib/prisma");
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Database query timeout")), 3000);
    });
    
    const queryPromise = prisma.$queryRaw`SELECT 1`;
    
    await Promise.race([queryPromise, timeoutPromise]);
    
    const responseTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
      responseTime: `${responseTime}ms`,
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    console.error("[DB Health Check] Error:", errorMessage);
    
    return NextResponse.json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: errorMessage,
      responseTime: `${responseTime}ms`,
    }, { status: 503 });
  }
}
