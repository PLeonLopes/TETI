import { Router } from "express";
import { teamController } from "../controllers/teamController";

const router = Router();

router.post("/team/create", teamController.createTeam);
router.get("/team/all", teamController.getAllTeams);
router.get("/team/:id", teamController.getTeamById);
router.put("/team/:id", teamController.updateTeam);
router.delete("/team/:id", teamController.deleteTeam);

export default router;
