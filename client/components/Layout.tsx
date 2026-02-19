import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ProjectView from "../pages/ProjectView";

export default function Layout() {
  return (
    <div className="app-shell">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <ProjectView />
        </main>
      </div>
    </div>
  );
}
