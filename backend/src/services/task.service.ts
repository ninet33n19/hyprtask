import * as projectQueries from "../db/queries/project.queries";
import * as taskQueries from "../db/queries/task.queries";
import * as workspaceQueries from "../db/queries/workspace.queries";
import type { TaskStatus } from "../types/task.type";
import { pool } from "../db/pool";

export async function createTask(
  userId: string,
  projectId: string,
  title: string,
  description?: string,
  assignedTo?: string,
  dueDate?: string,
) {
  const project = await projectQueries.getProjectById(projectId);

  if (!project) {
    const error = new Error("Project not found") as any;
    error.statusCode = 404;
    throw error;
  }

  const isMember = await workspaceQueries.isMemberOfWorkspace(
    userId,
    project.workspace_id,
  );

  if (!isMember) {
    const error = new Error("Access denied") as any;
    error.statusCode = 403;
    throw error;
  }

  return taskQueries.createTask(
    projectId,
    title,
    description,
    assignedTo,
    dueDate,
  );
}

export async function changeTaskStatus(
  userId: string,
  taskId: string,
  status: TaskStatus,
) {
  if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
    const error = new Error("Invalid status") as any;
    error.statusCode = 400;
    throw error;
  }

  // Fetch task with project join
  const taskResult = await pool.query(
    `
    SELECT t.*, p.workspace_id
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    WHERE t.id = $1
    `,
    [taskId],
  );

  const task = taskResult.rows[0];

  if (!task) {
    const error = new Error("Task not found") as any;
    error.statusCode = 404;
    throw error;
  }

  const isMember = await workspaceQueries.isMemberOfWorkspace(
    userId,
    task.workspace_id,
  );

  if (!isMember) {
    const error = new Error("Access denied") as any;
    error.statusCode = 403;
    throw error;
  }

  return taskQueries.updateTaskStatus(taskId, status);
}

export async function listTasks(
  userId: string,
  projectId: string,
  status?: TaskStatus,
  page: number = 1,
  limit: number = 20,
) {
  const offset = (page - 1) * limit;

  return taskQueries.getTasksByProject(projectId, status, limit, offset);
}
