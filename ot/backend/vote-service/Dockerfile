FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

RUN npm run build

# elimina devDependencies después de compilar (opcional)
RUN npm prune --omit=dev

EXPOSE 5003

CMD ["npm", "start"]