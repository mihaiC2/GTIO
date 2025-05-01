#!/bin/bash
set -e # si falla algo el workflow se detiene

# Lista de carpetas de microservicios
services=("auth-service" "user-service" "singer-service" "vote-service")

for service in "${services[@]}"; do
  if [ -d "$service" ]; then
    cd "$service"
    echo "Ejecutando los tests de $service"
    npm run test
    cd ..
  else
    echo "La carpeta $service no existe"
  fi
done