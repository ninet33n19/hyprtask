export type User = {
  id: string;
  email: string;
};

export type Workspace = {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
};

export type Project = {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
};
