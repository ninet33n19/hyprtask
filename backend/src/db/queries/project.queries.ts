import { v7 as uuidv7 } from "uuid";
import { pool } from "../pool";

export async function createProject(workspaceId: string, name: string) {
  const result = await pool.query(
    `
      INSERT INTO projects (id, workspace_id, name)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
    [uuidv7(), workspaceId, name],
  );

  return result.rows[0];
}

export async function getProjectsByWorkspace(workspaceId: string) {
  const result = await pool.query(
    `
    SELECT * FROM PROJECTS
    WHERE workspace_id = $1
    ORDER BY created_at DESC
    `,
    [workspaceId],
  );

  return result.rows;
}

export async function getProjectById(projectId: string) {
  const result = await pool.query(
    `
    SELECT *
    FROM projects
    WHERE id = $1
    `,
    [projectId],
  );

  return result.rows[0];
}
