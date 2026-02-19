import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { findUserById } from "../db/queries/user.queries";
import { loginUser, registerUser } from "../services/auth.service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = registerSchema.parse(req.body);
    const { email, password } = parsed;

    const user = await registerUser(email, password);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, password } = parsed;

    const { token, user } = await loginUser(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Logged in successfully",
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out",
  });
};

export const me = async (
  req: Request & { user?: { userId: string } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    res.json({
      success: true,
      data: { id: user.id, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};
