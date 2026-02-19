import React from "react";
import type { Task } from "../types";
import TaskRow from "./TaskRow";
import EmptyState from "./EmptyState";

type Props = {
  tasks: Task[];
  loading: boolean;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onAddTask?: () => void;
  emptyMessage?: string;
};

export default function TaskList({
  tasks,
  loading,
  onStatusChange,
  onAddTask,
  emptyMessage = "No tasks yet.",
}: Props) {
  if (loading) {
    return (
      <div className="task-list task-list--loading">
        <div className="task-list-skeleton" />
        <div className="task-list-skeleton" />
        <div className="task-list-skeleton" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description="Create a task to get started."
        action={
          onAddTask ? (
            <button type="button" className="btn btn--primary" onClick={onAddTask}>
              New task
            </button>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task, i) => (
        <TaskRow
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          style={{ animationDelay: `${i * 0.03}s` }}
        />
      ))}
    </div>
  );
}
