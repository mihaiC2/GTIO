#!/bin/bash

set -e

# Configuraciones iniciales
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="902394330911"

# Lista de carpetas de microservicios
services=("auth-service" "user-service" "singer-service" "vote-service")

echo "Iniciando construcción y push de imágenes Docker a ECR..."

# Login a ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

for service in "${services[@]}"; do
  cd ..
  if [ -d "$service" ]; then
    cd "$service"

    echo "🔨 Construyendo imagen Docker para $service..."
    docker build -t $service .

    echo "📤 Etiquetando imagen para ECR..."
    docker tag $service:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$service:latest

    echo "🚀 Pushing imagen a ECR..."
    docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/$service:latest

  else
    echo "❌ La carpeta $service no existe"
  fi
done

echo "✅ ¡Construcción y push completados para todos los microservicios!"
