import { Router } from "express";
import { taskController } from "../controllers/taskController";

const router = Router();

router.post("/task/create", taskController.createTask);
router.get("/task/all", taskController.getAllTasks);
router.get("/task/:id", taskController.getTaskById);
router.put("/task/:id", taskController.updateTask);
router.delete("/task/:id", taskController.deleteTask);

export default router;
