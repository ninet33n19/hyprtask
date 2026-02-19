import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
