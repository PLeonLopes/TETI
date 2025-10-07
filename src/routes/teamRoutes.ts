import { Router } from "express";
import { teamController } from "../controllers/teamController";
import { validate } from "../middlewares/validate";
import { createTeamSchema, updateTeamSchema } from "../schemas/teamSchema";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /team/create:
 *   post:
 *     tags:
 *       - Team
 *     summary: Cria um novo time
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Time criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 */
router.post("/team/create", validate(createTeamSchema), teamController.createTeam);

/**
 * @swagger
 * /team/all:
 *   get:
 *     tags:
 *       - Team
 *     summary: Retorna todos os times
 *     responses:
 *       200:
 *         description: Lista de times
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
 *                     $ref: '#/components/schemas/Team'
 */
router.get("/team/all", teamController.getAllTeams);

/**
 * @swagger
 * /team/{id}:
 *   get:
 *     tags:
 *       - Team
 *     summary: Retorna um time pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Time encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 */
router.get("/team/:id", teamController.getTeamById);

/**
 * @swagger
 * /team/{id}:
 *   put:
 *     tags:
 *       - Team
 *     summary: Atualiza um time
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Time atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 */
router.put("/team/:id", validate(updateTeamSchema), teamController.updateTeam);

/**
 * @swagger
 * /team/{id}:
 *   delete:
 *     tags:
 *       - Team
 *     summary: Deleta um time
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Time deletado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 */
router.delete("/team/:id", teamController.deleteTeam);

export default router;
