# Use Node 20 como base
FROM node:20

# Instala netcat (necessário para o entrypoint)
RUN apt-get update && apt-get install -y netcat-traditional

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json DO BACKEND
COPY server/package*.json ./

# Instala dependências
RUN npm install

# Copia o restante dos arquivos do backend
COPY server/tsconfig.json ./
COPY server/entrypoint.studio.sh ./
COPY server/prisma ./prisma
COPY server/src ./src

# Expõe a porta
EXPOSE 3000

# Comando para rodar em dev com tsx
CMD ["npm", "run", "dev"]
