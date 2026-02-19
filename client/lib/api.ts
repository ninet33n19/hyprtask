import { API_BASE } from "../config";
import type { Project, Task, User, Workspace } from "../types";

export type ApiResponse<T> =
  | { success: true; data?: T; message?: string }
  | { success: false; message: string };

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(fn: () => void) {
  onUnauthorized = fn;
}

async function request<T>(
  path: string,
  options: RequestInit & { parseJson?: boolean } = {},
): Promise<{ data?: T; error?: string; status: number }> {
  const { parseJson = true, ...init } = options;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string>),
    },
  });

  if (res.status === 401 && onUnauthorized) {
    onUnauthorized();
    return { error: "Unauthorized", status: 401 };
  }

  if (!parseJson) {
    return { status: res.status };
  }

  const json = (await res.json().catch(() => ({}))) as ApiResponse<T>;
  if (!res.ok) {
    return {
      error: "message" in json ? json.message : "Request failed",
      status: res.status,
    };
  }
  return {
    data: "data" in json ? (json.data as T) : undefined,
    status: res.status,
  };
}

export const authApi = {
  async me(): Promise<{ user?: User; error?: string }> {
    const { data, error } = await request<User>("/auth/me");
    if (error) return { error };
    return { user: data ?? undefined };
  },

  async register(email: string, password: string): Promise<{ user?: User; error?: string }> {
    const { data, error } = await request<{ id: string; email: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (error) return { error };
    return { user: data ? { id: data.id, email: data.email } : undefined };
  },

  async login(email: string, password: string): Promise<{ user?: User; error?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = (await res.json()) as ApiResponse<unknown> & { user?: User };
    if (!res.ok) {
      return { error: json.message ?? "Login failed" };
    }
    return { user: json.user ?? undefined };
  },

  async logout(): Promise<void> {
    await request("/auth/logout", { method: "POST", parseJson: false });
  },
};

export const workspacesApi = {
  async list(): Promise<{ data?: Workspace[]; error?: string }> {
    const { data, error } = await request<Workspace[]>("/workspaces");
    return { data: data ?? undefined, error };
  },

  async create(name: string): Promise<{ data?: Workspace; error?: string }> {
    const { data, error } = await request<Workspace>("/workspaces", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    return { data: data ?? undefined, error };
  },
};

export const projectsApi = {
  async list(workspaceId: string): Promise<{ data?: Project[]; error?: string }> {
    const { data, error } = await request<Project[]>(
      `/projects?workspaceId=${encodeURIComponent(workspaceId)}`,
    );
    return { data: data ?? undefined, error };
  },

  async create(workspaceId: string, name: string): Promise<{ data?: Project; error?: string }> {
    const { data, error } = await request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify({ workspaceId, name }),
    });
    return { data: data ?? undefined, error };
  },
};

export type CreateTaskBody = {
  projectId: string;
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
};

export const tasksApi = {
  async list(
    projectId: string,
    opts?: { status?: string; page?: number; limit?: number },
  ): Promise<{ data?: Task[]; error?: string }> {
    const params = new URLSearchParams({ projectId });
    if (opts?.status) params.set("status", opts.status);
    if (opts?.page != null) params.set("page", String(opts.page));
    if (opts?.limit != null) params.set("limit", String(opts.limit));
    const { data, error } = await request<Task[]>(`/tasks?${params}`);
    const normalized = data?.map((t) => ({
      ...t,
      status: (t.status === "PROGRESS" ? "IN_PROGRESS" : t.status) as Task["status"],
    }));
    return { data: normalized ?? undefined, error };
  },

  async create(body: CreateTaskBody): Promise<{ data?: Task; error?: string }> {
    const { data, error } = await request<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return { data: data ?? undefined, error };
  },

  async updateStatus(taskId: string, status: Task["status"]): Promise<{ data?: Task; error?: string }> {
    const { data, error } = await request<Task>("/tasks/status", {
      method: "PATCH",
      body: JSON.stringify({ taskId, status }),
    });
    return { data: data ?? undefined, error };
  },
};
