import { Router } from "express";
import { userController } from "../controllers/userController";

const router = Router();

router.post("/user/create", userController.createUser);
router.get("/user/all", userController.getAllUsers);
router.get("/user/:id", userController.getUserById);
router.put("/user/:id", userController.updateUser);
router.delete("/user/:id", userController.deleteUser);

export default router;
