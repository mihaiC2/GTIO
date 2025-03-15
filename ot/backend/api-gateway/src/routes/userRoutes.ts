import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const userRoutes = Router();

// Redirige todas las solicitudes de /api/users al microservicio de usuarios
userRoutes.use(
  '/',
  createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/users': '/api/users',
    },
  })
);

export default userRoutes;
