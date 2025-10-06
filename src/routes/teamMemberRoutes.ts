import { Router } from "express";
import { teamMemberController } from "../controllers/teamMemberController";

const router = Router();

router.post("/member/add", teamMemberController.addMember);
router.get("/member/:teamId", teamMemberController.getMembersByTeam);
router.put("/member/update-role", teamMemberController.updateMemberRole);
router.delete("/member/remove", teamMemberController.removeMember);

export default router;
