import React, { useEffect, useState } from "react";
import { workspacesApi, projectsApi } from "../lib/api";
import type { Project, Workspace } from "../types";
import { useSelection } from "../context/SelectionContext";
import Button from "./Button";
import Modal from "./Modal";
import Input from "./Input";

type SidebarState = {
  workspaces: Workspace[];
  projects: Project[];
  loadingWorkspaces: boolean;
  loadingProjects: boolean;
  createWorkspaceOpen: boolean;
  createProjectOpen: boolean;
  newWorkspaceName: string;
  newProjectName: string;
  createWorkspaceError?: string;
  createProjectError?: string;
};

export default function Sidebar() {
  const {
    selectedWorkspaceId,
    selectedProjectId,
    setSelectedWorkspaceId,
    setSelectedProjectId,
  } = useSelection();

  const [state, setState] = useState<SidebarState>({
    workspaces: [],
    projects: [],
    loadingWorkspaces: true,
    loadingProjects: false,
    createWorkspaceOpen: false,
    createProjectOpen: false,
    newWorkspaceName: "",
    newProjectName: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await workspacesApi.list();
      if (cancelled) return;
      setState((s) => ({ ...s, workspaces: data ?? [], loadingWorkspaces: false }));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedWorkspaceId) {
      setState((s) => ({ ...s, projects: [], loadingProjects: false }));
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loadingProjects: true }));
    (async () => {
      const { data } = await projectsApi.list(selectedWorkspaceId);
      if (cancelled) return;
      setState((s) => ({ ...s, projects: data ?? [], loadingProjects: false }));
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedWorkspaceId]);

  const openCreateWorkspace = () => {
    setState((s) => ({ ...s, createWorkspaceOpen: true, newWorkspaceName: "", createWorkspaceError: undefined }));
  };

  const openCreateProject = () => {
    setState((s) => ({ ...s, createProjectOpen: true, newProjectName: "", createProjectError: undefined }));
  };

  const createWorkspace = async () => {
    const name = state.newWorkspaceName.trim();
    if (!name) return;
    const { data, error } = await workspacesApi.create(name);
    if (error) {
      setState((s) => ({ ...s, createWorkspaceError: error }));
      return;
    }
    if (data) {
      setState((s) => ({
        ...s,
        workspaces: [data, ...s.workspaces],
        createWorkspaceOpen: false,
        newWorkspaceName: "",
        createWorkspaceError: undefined,
      }));
      setSelectedWorkspaceId(data.id);
      setSelectedProjectId(null);
    }
  };

  const createProject = async () => {
    const name = state.newProjectName.trim();
    if (!name || !selectedWorkspaceId) return;
    const { data, error } = await projectsApi.create(selectedWorkspaceId, name);
    if (error) {
      setState((s) => ({ ...s, createProjectError: error }));
      return;
    }
    if (data) {
      setState((s) => ({
        ...s,
        projects: [data, ...s.projects],
        createProjectOpen: false,
        newProjectName: "",
        createProjectError: undefined,
      }));
      setSelectedProjectId(data.id);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span className="sidebar-section-title">Workspaces</span>
          <button
            type="button"
            className="sidebar-add"
            onClick={openCreateWorkspace}
            title="New workspace"
          >
            +
          </button>
        </div>
        {state.loadingWorkspaces ? (
          <div className="sidebar-loading">Loading…</div>
        ) : (
          <ul className="sidebar-list">
            {state.workspaces.map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  className={`sidebar-item ${selectedWorkspaceId === w.id ? "sidebar-item--active" : ""}`}
                  onClick={() => {
                    setSelectedWorkspaceId(w.id);
                    setSelectedProjectId(null);
                  }}
                >
                  {w.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedWorkspaceId && (
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span className="sidebar-section-title">Projects</span>
            <button
              type="button"
              className="sidebar-add"
              onClick={openCreateProject}
              title="New project"
            >
              +
            </button>
          </div>
          {state.loadingProjects ? (
            <div className="sidebar-loading">Loading…</div>
          ) : (
            <ul className="sidebar-list">
              {state.projects.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`sidebar-item ${selectedProjectId === p.id ? "sidebar-item--active" : ""}`}
                    onClick={() => setSelectedProjectId(p.id)}
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {state.createWorkspaceOpen && (
        <Modal
          title="New workspace"
          onClose={() => setState((s) => ({ ...s, createWorkspaceOpen: false }))}
        >
          <div className="modal-form">
            <Input
              label="Name"
              value={state.newWorkspaceName}
              onChange={(e) => setState((s) => ({ ...s, newWorkspaceName: e.target.value }))}
              placeholder="Workspace name"
              autoFocus
            />
            {state.createWorkspaceError && (
              <p className="form-error">{state.createWorkspaceError}</p>
            )}
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setState((s) => ({ ...s, createWorkspaceOpen: false }))}>
                Cancel
              </Button>
              <Button onClick={createWorkspace}>Create</Button>
            </div>
          </div>
        </Modal>
      )}

      {state.createProjectOpen && (
        <Modal
          title="New project"
          onClose={() => setState((s) => ({ ...s, createProjectOpen: false }))}
        >
          <div className="modal-form">
            <Input
              label="Name"
              value={state.newProjectName}
              onChange={(e) => setState((s) => ({ ...s, newProjectName: e.target.value }))}
              placeholder="Project name"
              autoFocus
            />
            {state.createProjectError && (
              <p className="form-error">{state.createProjectError}</p>
            )}
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setState((s) => ({ ...s, createProjectOpen: false }))}>
                Cancel
              </Button>
              <Button onClick={createProject}>Create</Button>
            </div>
          </div>
        </Modal>
      )}
    </aside>
  );
}
