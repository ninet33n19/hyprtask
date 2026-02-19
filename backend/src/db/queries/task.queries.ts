import { v7 as uuidv7 } from "uuid";
import type { TaskStatus } from "../../types/task.type";
import { pool } from "../pool";

export async function createTask(
  projectId: string,
  title: string,
  description?: string,
  assignedTo?: string,
  dueDate?: string,
) {
  const result = await pool.query(
    `
    INSERT INTO tasks (id, project_id, title, description, assigned_to, due_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      uuidv7(),
      projectId,
      title,
      description || null,
      assignedTo || null,
      dueDate || null,
    ],
  );

  return result.rows[0];
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const dbStatus = status === "IN_PROGRESS" ? "PROGRESS" : status;
  const result = await pool.query(
    `
    UPDATE tasks
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [dbStatus, taskId],
  );

  return result.rows[0];
}

export async function getTasksByProject(
  projectId: string,
  status?: TaskStatus,
  limit: number = 20,
  offset: number = 0,
) {
  let query = `
    SELECT *
    FROM tasks
    WHERE project_id = $1
  `;

  const values: any[] = [projectId];
  let index = 2;

  if (status) {
    query += ` AND status = $${index}`;
    values.push(status);
    index++;
  }

  query += ` ORDER BY created_at DESC LIMIT $${index} OFFSET $${index + 1}`;
  values.push(limit, offset);

  const result = await pool.query(query, values);
  return result.rows;
}
