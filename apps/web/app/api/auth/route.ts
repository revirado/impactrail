import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponse, User } from "@impactrail/shared-types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");

  const where = role ? { role } : {};

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const response: ApiResponse<User[]> = {
    success: true,
    data: users as unknown as User[],
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Email is required",
    };
    return NextResponse.json(response, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const response: ApiResponse<null> = {
      success: false,
      error: "User not found",
    };
    return NextResponse.json(response, { status: 404 });
  }

  const response: ApiResponse<User> = {
    success: true,
    data: user as unknown as User,
    message: "Login successful",
  };

  return NextResponse.json(response);
}
