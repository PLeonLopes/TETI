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

# Expõe a porta
EXPOSE 3000

# Comando para rodar em dev com tsx
CMD ["npm", "run", "dev"]
