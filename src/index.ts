import express from "express";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import teamMember from "./routes/teamMemberRoutes";

const app = express();
const port = process.env.PORT || 3000;

// Receber JSON no body
app.use(express.json());

// Rotas da API
app.use(userRoutes);
app.use(teamRoutes)
app.use(teamMember)

// Rota raiz apenas para teste
app.get("/", (_req, res) => {
  res.send("API em execução!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
