FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Gera o cliente do Prisma (importante!)
RUN npx prisma generate

# Compila o TypeScript
RUN npm run build

# Copia os arquivos gerados do Prisma (JS) para o dist
RUN mkdir -p dist/src/generated && cp -r src/generated/* dist/src/generated/

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
