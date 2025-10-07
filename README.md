# DocFlow: Sistema Gerenciador de Projetos

**DocFlow** é um **gerenciador de tarefas para equipes**, inspirado no Trello. Ele permite criar, organizar e acompanhar projetos e tarefas em tempo real, com API robusta e containerização completa via Docker.



## 🛠 Tecnologias

* **[Node.js](https://nodejs.org/pt) + [TypeScript](https://www.typescriptlang.org/)** – Backend tipado e escalável
* **[Prisma](https://www.prisma.io/)** – ORM para PostgreSQL
* **[PostgreSQL](https://www.postgresql.org/)** – Banco de dados relacional
* **[Docker](https://www.docker.com/products/docker-desktop/) & Docker Compose** – Containerização dos serviços
* **[Zod](https://zod.dev/)** – Validação de dados
* **[Swagger](https://swagger.io/)** – Documentação interativa da API



## 🚀 Funcionalidades

* Gestão de **projetos**, **tarefas** e **equipes**
* Atribuição de tarefas a membros da equipe
* Controle de **status**, **prioridade** e **datas de entrega**
* Visualização do banco em tempo real com **Prisma Studio**
* Documentação completa da API via **Swagger**



## ⚡ Pré-requisitos

* **Docker** e **Docker Compose**
* **[Git](https://git-scm.com/)**



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
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=tetidb
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public"
PORT=3000
```

### 3. Suba todos os serviços com Docker

```bash
docker-compose up --build
```



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



## 📊 [Prisma Studio](https://www.prisma.io/studio)

* Visualize e edite os dados do banco em tempo real
* Navegue entre tabelas e relações
* Crie, edite ou exclua registros facilmente

Acesse: `http://localhost:5555`

## 🗃️ Esquema do Banco de Dados

```prisma
model User {
  id         Int       @id @default(autoincrement())
  name       String
  email      String    @unique
  password   String
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  teams      TeamMember[]
  projects   Project[] @relation("UserProjects")
  tasks      Task[]    @relation("UserTasks")
  comments   Comment[]

  @@map("user")
}

model Team {
  id          Int           @id @default(autoincrement())
  name        String        @unique
  description String?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  members     TeamMember[]
  projects    Project[]

  @@map("team")
}

model TeamMember {
  id      Int    @id @default(autoincrement())
  role    String @default("member")
  userId  Int
  teamId  Int

  user User @relation(fields: [userId], references: [id])
  team Team @relation(fields: [teamId], references: [id])

  @@unique([userId, teamId])

  @@map("team_member")
}

model Project {
  id          Int       @id @default(autoincrement())
  name        String
  description String?
  teamId      Int
  ownerId     Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  team   Team   @relation(fields: [teamId], references: [id])
  owner  User   @relation("UserProjects", fields: [ownerId], references: [id])
  tasks  Task[]
}

model Task {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  status      String    @default("todo") // todo, doing, done
  priority    String    @default("medium") // low, medium, high
  dueDate     DateTime?
  projectId   Int
  assignedId  Int?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  project   Project @relation(fields: [projectId], references: [id])
  assigned  User?   @relation("UserTasks", fields: [assignedId], references: [id])
  comments  Comment[]
}

model Comment {
  id        Int       @id @default(autoincrement())
  content   String
  taskId    Int
  authorId  Int
  createdAt DateTime  @default(now())

  task   Task @relation(fields: [taskId], references: [id])
  author User @relation(fields: [authorId], references: [id])
}
```


## 🔗 Validação com Zod

| Recurso            | Regras principais de validação                                                    |
| ------------------ | --------------------------------------------------------------------------------- |
| **Usuário**        | Nome entre 3 e 100 caracteres, email válido e senha entre 6 e 100 caracteres      |
| **Projeto**        | Nome mínimo de 3 caracteres, IDs de time e dono válidos                           |
| **Tarefa**         | Título mínimo de 3 caracteres, status e prioridade dentro de enums, datas válidas |
| **Time**           | Nome mínimo de 3 caracteres, descrição opcional                                   |
| **Membro de time** | Role entre `member` ou `admin`, IDs válidos de usuário e time                     |
| **Comentário**     | Conteúdo não vazio, IDs válidos de tarefa e autor                                 |

## 🗂 Estrutura Geral do Projeto

```
./
├── prisma/
│   ├── client.ts           # Prisma Client
│   └── schema.prisma       # Schema do banco
├── src/
│   ├── controllers/        # Lógica dos endpoints
│   ├── middlewares/        # Middlewares (ex: validação)
│   ├── routes/             # Rotas da API
│   ├── schemas/            # Schemas de validação Zod
│   ├── services/           # Serviços de negócio
│   ├── utils/              # Utilitários (ex: erros)
│   ├── index.ts            # Entrada da API
│   └── swagger.ts          # Configuração Swagger
├── .env_example            # Exemplo de variáveis de ambiente
├── docker-compose.yml      # Orquestração dos containers
├── Dockerfile              # Container da API
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```