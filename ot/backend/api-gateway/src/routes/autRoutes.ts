import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const authRoutes = Router();

// Redirige todas las solicitudes de /api/auth al microservicio de autenticación
authRoutes.use(
  '/',
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '/api/auth', // Reescribe el prefijo, si es necesario
    },
  })
);

export default authRoutes;
