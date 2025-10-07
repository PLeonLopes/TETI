import { Router } from "express";
import { taskController } from "../controllers/taskController";
import { validate } from "../middlewares/validate";
import { createTaskSchema, updateTaskSchema } from "../schemas/taskSchema";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         projectId:
 *           type: integer
 *           description: ID do projeto ao qual a tarefa pertence
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         assignedTo:
 *           type: integer
 *           nullable: true
 *           description: ID do membro designado para a tarefa
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /task/create:
 *   post:
 *     tags:
 *       - Task
 *     summary: Cria uma nova tarefa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               projectId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *               assignedTo:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 */
router.post("/task/create", validate(createTaskSchema), taskController.createTask);

/**
 * @swagger
 * /task/all:
 *   get:
 *     tags:
 *       - Task
 *     summary: Retorna todas as tarefas
 *     responses:
 *       200:
 *         description: Lista de tarefas
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
 *                     $ref: '#/components/schemas/Task'
 */
router.get("/task/all", taskController.getAllTasks);

/**
 * @swagger
 * /task/{id}:
 *   get:
 *     tags:
 *       - Task
 *     summary: Retorna uma tarefa pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 */
router.get("/task/:id", taskController.getTaskById);

/**
 * @swagger
 * /task/{id}:
 *   put:
 *     tags:
 *       - Task
 *     summary: Atualiza uma tarefa existente
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *               assignedTo:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tarefa atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 */
router.put("/task/:id", validate(updateTaskSchema), taskController.updateTask);

/**
 * @swagger
 * /task/{id}:
 *   delete:
 *     tags:
 *       - Task
 *     summary: Deleta uma tarefa existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarefa deletada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 */
router.delete("/task/:id", taskController.deleteTask);

export default router;
