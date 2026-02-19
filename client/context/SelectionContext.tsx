import React, { createContext, useContext, useState } from "react";

type SelectionContextValue = {
  selectedWorkspaceId: string | null;
  selectedProjectId: string | null;
  setSelectedWorkspaceId: (id: string | null) => void;
  setSelectedProjectId: (id: string | null) => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  return (
    <SelectionContext.Provider
      value={{
        selectedWorkspaceId,
        selectedProjectId,
        setSelectedWorkspaceId,
        setSelectedProjectId,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}
