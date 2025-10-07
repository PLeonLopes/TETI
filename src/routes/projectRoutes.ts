import { Router } from "express";
import { projectController } from "../controllers/projectController";

const router = Router();

router.post("/project/create", projectController.createProject);
router.get("/project/all", projectController.getAllProjects);
router.get("/project/:id", projectController.getProjectById);
router.put("/project/:id", projectController.updateProject);
router.delete("/project/:id", projectController.deleteProject);

export default router;
