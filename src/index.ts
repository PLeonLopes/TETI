import express from "express";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import teamMember from "./routes/teamMemberRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";

const app = express();
const port = process.env.PORT || 3000;

// Receber JSON no body
app.use(express.json());

// Rotas da API
app.use(userRoutes);
app.use(teamRoutes)
app.use(teamMember)
app.use(projectRoutes)
app.use(taskRoutes);

// Rota raiz apenas para teste
app.get("/", (_req, res) => {
  res.send("API em execução!");
});

// Start do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
