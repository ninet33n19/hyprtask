import { v7 as uuidv7 } from "uuid";
import { pool } from "../pool";

export const createWorkspaceWithOwner = async (
  userId: string,
  name: string,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const workspaceResult = await client.query(
      `
      INSERT INTO workspaces (id, name, owner_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, owner_id, created_at
      `,
      [uuidv7(), name, userId],
    );

    const workspace = workspaceResult.rows[0];

    await client.query(
      `
      INSERT INTO workspace_members (id, workspace_id, user_id, role)
      VALUES ($1,$2, $3, 'ADMIN')
      `,
      [uuidv7(), workspace.id, userId],
    );

    await client.query("COMMIT");

    return workspace;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const getUserWorkspaces = async (userId: string) => {
  const result = await pool.query(
    `
    SELECT w.*
    FROM workspaces w
    JOIN workspace_members wm ON wm.workspace_id = w.id
    WHERE wm.user_id = $1
    `,
    [userId],
  );

  return result.rows;
};

export async function isMemberOfWorkspace(
  userId: string,
  workspaceId: string,
): Promise<boolean> {
  const result = await pool.query(
    `
      SELECT 1
      FROM workspace_members
      WHERE user_id = $1 AND workspace_id = $2
    `,
    [userId, workspaceId],
  );

  return (result.rowCount ?? 0) > 0; // '??' is a nullish coalescing operator returns its right-hand operand when the left-hand operand is null or undefined, and otherwise returns the left-hand operand
}
