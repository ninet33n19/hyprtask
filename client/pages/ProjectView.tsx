import React, { useEffect, useState } from "react";
import { useSelection } from "../context/SelectionContext";
import { tasksApi } from "../lib/api";
import type { Task } from "../types";
import Button from "../components/Button";
import TaskList from "../components/TaskList";
import Modal from "../components/Modal";
import Input from "../components/Input";

export default function ProjectView() {
  const { selectedProjectId } = useSelection();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    if (!selectedProjectId) {
      setTasks([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data } = await tasksApi.list(selectedProjectId);
      if (cancelled) return;
      setTasks(data ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedProjectId]);

  const refreshTasks = async () => {
    if (!selectedProjectId) return;
    const { data } = await tasksApi.list(selectedProjectId);
    setTasks(data ?? []);
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    const { data, error } = await tasksApi.updateStatus(taskId, status);
    if (error) return;
    if (data) {
      const normalized = {
        ...data,
        status: (data.status === "PROGRESS" ? "IN_PROGRESS" : data.status) as Task["status"],
      };
      setTasks((prev) => prev.map((t) => (t.id === taskId ? normalized : t)));
    }
  };

  const openCreate = () => {
    setCreateOpen(true);
    setNewTitle("");
    setNewDescription("");
    setCreateError("");
  };

  const createTask = async () => {
    const title = newTitle.trim();
    if (!title || !selectedProjectId) return;
    const { data, error } = await tasksApi.create({
      projectId: selectedProjectId,
      title,
      description: newDescription.trim() || undefined,
    });
    if (error) {
      setCreateError(error);
      return;
    }
    if (data) {
      setTasks((prev) => [data, ...prev]);
      setCreateOpen(false);
    }
  };

  if (!selectedProjectId) {
    return (
      <div className="project-view project-view--empty">
        <p className="project-view-empty-text">Select a project from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="project-view">
      <div className="project-view-header">
        <h1 className="project-view-title">Tasks</h1>
        <Button onClick={openCreate}>New task</Button>
      </div>
      <TaskList
        tasks={tasks}
        loading={loading}
        onStatusChange={handleStatusChange}
        onAddTask={openCreate}
      />

      {createOpen && (
        <Modal title="New task" onClose={() => setCreateOpen(false)}>
          <div className="modal-form">
            <Input
              label="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
            <Input
              label="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description"
            />
            {createError && <p className="form-error">{createError}</p>}
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createTask}>Create</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
