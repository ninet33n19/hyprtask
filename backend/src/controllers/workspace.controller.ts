import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as workspaceService from "../services/workspace.service";

/**
 * Custom request interface to include user property added by auth middleware
 */
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

export const createWorkspace: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const authReq = req as AuthenticatedRequest;

    const workspace = await workspaceService.createWorkspace(
      authReq.user.userId,
      name,
    );

    res.status(201).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaces: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const workspaces = await workspaceService.listUserWorkspaces(
      authReq.user.userId,
    );

    res.json({
      success: true,
      data: workspaces,
    });
  } catch (err) {
    next(err);
  }
};
