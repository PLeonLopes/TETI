import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send("API em execução!");
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});