#!/bin/sh

DB_PATH="/home/node/app/tmp/database.sqlite"

if [ ! -f "$DB_PATH" ]; then
  echo "Banco de dados não encontrado. Executando migrations..."
  node ace migration:fresh --seed --force

else
  echo "Banco de dados encontrado. Nenhuma ação de migration necessária."
fi

# Executa o comando principal do container
exec "$@"