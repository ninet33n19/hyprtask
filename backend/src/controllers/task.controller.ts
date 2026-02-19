import type { NextFunction, Request, RequestHandler, Response } from "express";
import * as taskService from "../services/task.service";

/**
 * Custom request interface to include user property added by auth middleware
 */
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

export const createTask: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, title, description, assignedTo, dueDate } = req.body;
    const authReq = req as AuthenticatedRequest;

    const task = await taskService.createTask(
      authReq.user.userId,
      projectId,
      title,
      description,
      assignedTo,
      dueDate,
    );

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTaskStatus: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { taskId, status } = req.body;
    const authReq = req as AuthenticatedRequest;

    const task = await taskService.changeTaskStatus(
      authReq.user.userId,
      taskId,
      status,
    );

    res.json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const getTasks: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { projectId, status, page = 1, limit = 20 } = req.query;
    const authReq = req as AuthenticatedRequest;

    const tasks = await taskService.listTasks(
      authReq.user.userId,
      projectId as string,
      status as string,
      Number(page),
      Number(limit),
    );

    res.json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
};
