CREATE TYPE task_status AS ENUM('TODO', 'PROGRESS', 'DONE');

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'TODO',
  assigned_to UUID REFERENCES users (id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
);

CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks (project_id);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks (assigned_to);
