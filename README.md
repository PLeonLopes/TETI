# DocFlow: Sistema Gerenciador de Projetos

**DocFlow** é um **gerenciador de tarefas para equipes**, inspirado no Trello.  
Permite criar, organizar e acompanhar projetos e tarefas em tempo real.

| <center>Kanban Visualization</center> |
|------------------|
| <img src="./docs/kanban.png" width="100%"/> |

## 🛠 Tecnologias

### Backend (`server/`)

* **[Node.js](https://nodejs.org/pt) + [TypeScript](https://www.typescriptlang.org/)** – Backend tipado e escalável
* **[Prisma](https://www.prisma.io/)** – ORM para PostgreSQL
* **[PostgreSQL](https://www.postgresql.org/)** – Banco de dados relacional
* **[Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose** – Containerização dos serviços
* **[Zod](https://zod.dev/)** – Validação de dados
* **[Swagger](https://swagger.io/)** – Documentação interativa da API

### Frontend (`client/`)

* **[Next.js](https://nextjs.org/docs)**
* **[React](https://react.dev/)**
* **[React Hook Form](https://react-hook-form.com/docs)**
* **[Zod](https://zod.dev/)** – Validação de dados
* **[Tailwind CSS](https://tailwindcss.com/)** - (Via Tailwind v4)

## 🚀 Funcionalidades

* Gestão de **projetos**, **tarefas** e **equipes**
* Atribuição de tarefas a membros da equipe
* Controle de **status**, **prioridade** e **datas de entrega**
* Visualização do banco em tempo real com **Prisma Studio**
* Documentação completa da API via **Swagger**
* Frontend em Next.js consumindo a API

## ⚡ Pré-requisitos

* **Docker** e **Docker Compose**
* **[Git](https://git-scm.com/)**

> Você **não precisa** instalar Node, npm ou PostgreSQL na máquina para rodar o projeto – tudo sobe via Docker.

## 🏗 Setup e execução

### 1. Clone o repositório

```bash
git clone https://github.com/PLeonLopes/TETI
cd TETI
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env_example .env
```

⚠️ Edite o `.env` se necessário, preenchendo as variáveis de acordo com seu ambiente:

```env
# Banco de dados
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=tetidb

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public"

# Porta da API (backend)
PORT=3000

# URL pública da API para o frontend
NEXT_PUBLIC_API_URL=http://localhost:3000
```

> ⚠️ NEXT_PUBLIC_API_URL é usada no frontend (Next.js) para consumir a API.

### 3. Suba todos os serviços com Docker
Tudo é orquestrado pelo docker-compose.yml na raiz.

```bash
docker-compose up --build
```

Isso vai subir:
* API (Swagger) – http://localhost:3000
* Frontend (Next.js) – http://localhost:3001
* Prisma Studio (Visualização do banco) – http://localhost:5555

> Na primeira vez, o build pode demorar um pouco, pois o Docker vai baixar imagens e instalar dependências.


## 📄 Documentação da API ([Swagger](https://swagger.io/))

A API possui documentação interativa:

* URL: `http://localhost:3000/api-docs`

### 📌 Endpoints Principais

| Recurso  | Rota Base   | Operações                         |
| -------- | ----------- | --------------------------------- |
| Projetos | `/projects` | Listar, Criar, Atualizar, Excluir |
| Tarefas  | `/tasks`    | Listar, Criar, Atualizar, Excluir |
| Equipes  | `/teams`    | Listar, Criar, Atualizar, Excluir |
| Usuários | `/users`    | Listar, Criar, Atualizar, Excluir |

> Detalhes e exemplos completos disponíveis no Swagger.

--- 

## 🔗 Validação com Zod

| Recurso            | Regras principais de validação                                                    |
| ------------------ | --------------------------------------------------------------------------------- |
| **Usuário**        | Nome entre 3 e 100 caracteres, email válido e senha entre 6 e 100 caracteres      |
| **Projeto**        | Nome mínimo de 3 caracteres, IDs de time e dono válidos                           |
| **Tarefa**         | Título mínimo de 3 caracteres, status e prioridade dentro de enums, datas válidas |
| **Time**           | Nome mínimo de 3 caracteres, descrição opcional                                   |
| **Membro de time** | Role entre `member` ou `admin`, IDs válidos de usuário e time                     |
| **Comentário**     | Conteúdo não vazio, IDs válidos de tarefa e autor                                 |

## 📊 [Prisma Studio](https://www.prisma.io/studio)

* Visualize e edite os dados do banco em tempo real
* Navegue entre tabelas e relações
* Crie, edite ou exclua registros facilmente

Acesse: `http://localhost:5555`

## 🗂 Estrutura Geral do Projeto

```bash
./
├── client/                  # Frontend (Next.js + React)
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── server/                  # Backend (Node.js + TS + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma    # Schema do banco
│   │   └── ...
│   ├── src/
│   │   ├── controllers/     # Lógica dos endpoints
│   │   ├── middlewares/     # Middlewares (ex: validação)
│   │   ├── routes/          # Rotas da API
│   │   ├── schemas/         # Schemas de validação Zod
│   │   ├── services/        # Regras de negócio
│   │   ├── utils/           # Utilitários (ex: erros)
│   │   └── index.ts         # Entrada da API
│   ├── entrypoint.studio.sh # Script para Prisma Studio
│   ├── Dockerfile           # Container da API/Studio
│   ├── package.json
│   └── tsconfig.json
├── .env                     # Variáveis de ambiente
├── .env_example             # Exemplo de variáveis de ambiente
├── docker-compose.yml       # Orquestração dos containers
└── README.md
```

## Deploy (Live Demo)

> **Aviso:** Os links abaixo são hospedados no [Render](https://render.com/) em ambiente gratuito e devem ficar disponíveis por cerca de **1 mês**. Após esse período, é possível que parem de funcionar.

- **Frontend (Next.js)**: https://teti-front-jx8y.onrender.com/auth/login
- **Backend (API)**: https://teti-z40i.onrender.com 
  - **Swagger**: https://teti-z40i.onrender.com/api-docs

> Como o backend está em ambiente gratuito, a **primeira requisição pode demorar alguns segundos** enquanto o servidor “acorda”.
