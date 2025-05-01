#!/bin/bash
set -e # si falla algo el workflow se detiene

# Lista de carpetas de microservicios
services=("auth-service" "user-service" "vote-service")

echo "Iniciando instalación de dependencias..."

for service in "${services[@]}"; do
  cd ..
  if [ -d "$service" ]; then
    cd "$service"
    if [ -f package.json ]; then
      echo "Ejecutando npm install en $service"
      npm install
    else
      echo "No se encontró package.json en $service"
    fi
  else
    echo "La carpeta $service no existe"
  fi
done
