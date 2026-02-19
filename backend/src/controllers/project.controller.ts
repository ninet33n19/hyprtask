import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as projectService from "../services/project.service";

/**
 * Custom request interface to include user property added by auth middleware
 */
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

export const createProject: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { workspaceId, name } = req.body;
    const authReq = req as AuthenticatedRequest;

    const project = await projectService.createProject(
      authReq.user.userId,
      workspaceId,
      name,
    );

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Projects are typically fetched via a GET request using query parameters
    const workspaceId = req.query.workspaceId as string;
    const authReq = req as AuthenticatedRequest;

    if (!workspaceId) {
      res.status(400).json({
        success: false,
        message: "workspaceId is required",
      });
      return;
    }

    const projects = await projectService.listProjects(
      authReq.user.userId,
      workspaceId,
    );

    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};
