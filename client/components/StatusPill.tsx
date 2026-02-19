import React from "react";
import type { TaskStatus } from "../types";

const LABELS: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

type Props = {
  status: TaskStatus;
  onChange?: (status: TaskStatus) => void;
  readOnly?: boolean;
};

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function StatusPill({ status, onChange, readOnly }: Props) {
  const label = LABELS[status] ?? status;

  if (readOnly || !onChange) {
    return <span className={`status-pill status-pill--${status.toLowerCase()}`}>{label}</span>;
  }

  return (
    <select
      className={`status-pill status-pill--select status-pill--${status.toLowerCase()}`}
      value={status}
      onChange={(e) => onChange(e.target.value as TaskStatus)}
      aria-label="Status"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {LABELS[s]}
        </option>
      ))}
    </select>
  );
}
