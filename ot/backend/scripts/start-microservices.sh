#!/bin/bash

# Lista de carpetas de microservicios
services=("auth-service" "user-service" "singer-service" "vote-service")

echo "Iniciando instalación de dependencias..."

for service in "${services[@]}"; do
  if [ -d "$service" ]; then
    cd "$service"
    if [ -f package.json ]; then
      echo "Ejecutando npm install en $service"
      npm install
    else
      echo "No se encontró package.json en $service"
    fi
    cd ..
  else
    echo "La carpeta $service no existe"
  fi
done

echo "Instalación completada!!"
