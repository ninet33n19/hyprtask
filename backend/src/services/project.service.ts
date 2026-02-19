import * as projectQueries from "../db/queries/project.queries";
import * as workspaceQueries from "../db/queries/workspace.queries";

interface HttpError extends Error {
  statusCode?: number;
}

export async function createProject(
  userId: string,
  workspaceId: string,
  name: string,
) {
  if (!name || name.trim().length < 2) {
    const error: HttpError = new Error(
      "Project name must be at least 2 characters long",
    );
    error.statusCode = 400;
    throw error;
  }

  const isMember = await workspaceQueries.isMemberOfWorkspace(
    userId,
    workspaceId,
  );
  if (!isMember) {
    const error: HttpError = new Error("Access Denied");
    error.statusCode = 403;
    throw error;
  }

  return projectQueries.createProject(workspaceId, name);
}

export async function listProjects(userId: string, workspaceId: string) {
  const isMember = await workspaceQueries.isMemberOfWorkspace(
    userId,
    workspaceId,
  );
  if (!isMember) {
    const error: HttpError = new Error("Access Denied");
    error.statusCode = 403;
    throw error;
  }

  return projectQueries.getProjectsByWorkspace(workspaceId);
}
