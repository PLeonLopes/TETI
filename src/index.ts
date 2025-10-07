import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import teamMemberRoutes from "./routes/teamMemberRoutes";
import projectRoutes from "./routes/projectRoutes"
import taskRoutes from "./routes/taskRoutes"

const app = express();
const port = process.env.PORT || 3000;

// Permite receber JSON no body
app.use(express.json());

// Configuração do Swagger
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DocFlow API",
      version: "1.0.0",
      description: "API estilo Trello para gerenciamento de usuários, projetos e tarefas",
    },
    servers: [
      { url: "http://localhost:3000" }
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // arquivos com comentários Swagger
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Rota do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Usa suas rotas exatamente como estão definidas
app.use(userRoutes);
app.use(teamRoutes);
app.use(teamMemberRoutes);
app.use(projectRoutes)
app.use(taskRoutes)

// Rota raiz apenas para teste
app.get("/", (_req, res) => {
  res.send("API em execução!");
});

// Start do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api-docs`);
});
