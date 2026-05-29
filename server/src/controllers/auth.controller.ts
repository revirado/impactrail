import type { Request, Response } from "express";
import prisma from "../db/prisma.js";
import type { ApiResponse, User } from "@impactrail/shared-types";

export async function getUsers(req: Request, res: Response): Promise<void> {
  const { role } = req.query;
  const where = role ? { role: role as string } : {};

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const response: ApiResponse<User[]> = {
    success: true,
    data: users as unknown as User[],
  };
  res.json(response);
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    const response: ApiResponse<null> = {
      success: false,
      error: "User not found",
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<User> = {
    success: true,
    data: user as unknown as User,
  };
  res.json(response);
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email } = req.body;

  if (!email) {
    const response: ApiResponse<null> = {
      success: false,
      error: "Email is required",
    };
    res.status(400).json(response);
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const response: ApiResponse<null> = {
      success: false,
      error: "User not found",
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<User> = {
    success: true,
    data: user as unknown as User,
    message: "Login successful",
  };
  res.json(response);
}
