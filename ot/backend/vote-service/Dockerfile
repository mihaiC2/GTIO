# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.14

FROM node:${NODE_VERSION}

# Use production node environment by default.
ENV NODE_ENV=production


WORKDIR /usr/src/app

# Copy the rest of the source files into the image.
COPY . .
RUN ["mkdir", "dist/logs"]
RUN chmod -R 777 dist/logs

# Expose the port that the application listens on.
EXPOSE 5003

# Run the application as a non-root user.
USER node

# Run the application.
CMD [ "node", "dist/vote-service/src/server.js"]
