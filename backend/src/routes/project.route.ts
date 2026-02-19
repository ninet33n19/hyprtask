import { Router } from "express";
import { createProject, getProjects } from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createProject);
router.get("/", getProjects);

export default router;
