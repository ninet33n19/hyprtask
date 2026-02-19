import { Router } from "express";
import {
  createWorkspace,
  getWorkspaces,
} from "../controllers/workspace.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createWorkspace);
router.get("/", getWorkspaces);

export default router;
