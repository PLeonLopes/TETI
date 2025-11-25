# Usa Node 22 (Ver engines do package.json)
FROM node:22

# Diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências do front
COPY package*.json ./
COPY yarn.lock .

# Instala dependências
RUN npm install

# Copia o restante do código do front
COPY . .

# Build de produção do Next (gera .next, pronto pra ser servido)
RUN npm run build

# Expõe a porta padrão do Next (dentro do container)
EXPOSE 3000

# roda em modo produção (sem dev, sem compiling)
CMD ["npm", "run", "start"]