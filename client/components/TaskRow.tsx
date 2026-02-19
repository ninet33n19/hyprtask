import React from "react";
import type { Task } from "../types";
import StatusPill from "./StatusPill";

type Props = {
  task: Task;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  style?: React.CSSProperties;
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function TaskRow({ task, onStatusChange, style }: Props) {
  return (
    <div className="task-row" style={style}>
      <div className="task-row-main">
        <span className="task-row-title">{task.title}</span>
        <StatusPill
          status={task.status}
          onChange={(status) => onStatusChange(task.id, status)}
        />
      </div>
      <div className="task-row-meta">
        <span className="task-row-assignee">{task.assigned_to ? task.assigned_to.slice(0, 8) + "…" : "Unassigned"}</span>
        <span className="task-row-due">{formatDate(task.due_date)}</span>
      </div>
    </div>
  );
}
