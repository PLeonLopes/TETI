import { Router } from "express";
import { teamMemberController } from "../controllers/teamMemberController";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     TeamMember:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         role:
 *           type: string
 *         userId:
 *           type: integer
 *         teamId:
 *           type: integer
 */

/**
 * @swagger
 * /member/add:
 *   post:
 *     tags:
 *       - TeamMember
 *     summary: Adiciona um membro a um time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - teamId
 *             properties:
 *               userId:
 *                 type: integer
 *               teamId:
 *                 type: integer
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Membro adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TeamMember'
 */
router.post("/member/add", teamMemberController.addMember);

/**
 * @swagger
 * /member/{teamId}:
 *   get:
 *     tags:
 *       - TeamMember
 *     summary: Retorna todos os membros de um time
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de membros do time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TeamMember'
 */
router.get("/member/:teamId", teamMemberController.getMembersByTeam);

/**
 * @swagger
 * /member/update-role:
 *   put:
 *     tags:
 *       - TeamMember
 *     summary: Atualiza a função de um membro do time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - teamId
 *               - role
 *             properties:
 *               userId:
 *                 type: integer
 *               teamId:
 *                 type: integer
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Função do membro atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TeamMember'
 */
router.put("/member/update-role", teamMemberController.updateMemberRole);

/**
 * @swagger
 * /member/remove:
 *   delete:
 *     tags:
 *       - TeamMember
 *     summary: Remove um membro do time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - teamId
 *             properties:
 *               userId:
 *                 type: integer
 *               teamId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Membro removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/TeamMember'
 */
router.delete("/member/remove", teamMemberController.removeMember);

export default router;
