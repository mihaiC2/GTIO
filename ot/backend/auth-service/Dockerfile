FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci 

COPY . .

RUN npm run build

# elimina devDependencies después de compilar (opcional)
RUN npm prune --omit=dev

EXPOSE 5000

CMD ["npm", "start"]