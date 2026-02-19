import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";
import workspaceRoutes from "./routes/workspace.route";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
