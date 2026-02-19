import {
  createWorkspaceWithOwner,
  getUserWorkspaces,
} from "../db/queries/workspace.queries";

export const createWorkspace = async (userId: string, name: string) => {
  if (!name || name.trim().length < 2) {
    const error = new Error(
      "Workspace name must be at least 2 characters long",
    );
    error.name = "ValidationError";
    throw error;
  }

  return createWorkspaceWithOwner(userId, name);
};

export const listUserWorkspaces = (userId: string) => {
  return getUserWorkspaces(userId);
};
