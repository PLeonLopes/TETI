# Use Node 20 como base
FROM node:20

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do código
COPY . .

# Gera o cliente do Prisma (importante!)
RUN npx prisma generate

# Compila o TypeScript
RUN npm run build

# Expõe a porta
EXPOSE 3000

# Executa o migrate e roda em prod
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
