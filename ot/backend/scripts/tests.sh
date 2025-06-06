#!/bin/bash
set -e # si falla algo el workflow se detiene

# Lista de carpetas de microservicios
services=("auth-service" "user-service" "vote-service")

for service in "${services[@]}"; do
  cd ..
  if [ -d "$service" ]; then
    cd "$service"
    echo "Ejecutando los tests de $service"
    npm run test
  else
    echo "La carpeta $service no existe"
  fi
done