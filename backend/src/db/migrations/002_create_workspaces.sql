CREATE TYPE member_role AS ENUM('ADMIN', 'MEMBER');

CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces (id) ON DELETE CASCADE,
  user_id UUID REFERENCES users (id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'MEMBER',
  UNIQUE (workspace_id, user_id) -- this is a Composite Unique Constraint, so a specific user can only be a member of specific workspace once, you cannot add a user twice in the same workspace
);

CREATE INDEX IF NOT EXISTS idx_workspace_owner ON workspaces (owner_id);

CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members (user_id);

CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace ON workspace_members (workspace_id);
