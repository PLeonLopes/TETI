#!/bin/sh
echo "Aguardando banco de dados..."
until nc -z postgres 5432; do
  sleep 2
done

echo "Banco disponível! Rodando migrações..."
npx prisma db push

echo "Iniciando Prisma Studio..."
npx prisma studio
