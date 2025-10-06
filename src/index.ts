import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
const port = process.env.PORT || 3000;

// Permite receber JSON no body
app.use(express.json());

// Usa suas rotas exatamente como estão definidas
app.use(userRoutes);

// Rota raiz apenas para teste
app.get("/", (_req, res) => {
  res.send("API em execução!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
