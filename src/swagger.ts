// src/swagger.ts
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import type { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DocFlow API',
      version: '1.0.0',
      description: 'API estilo Trello para gerenciamento de projetos',
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
