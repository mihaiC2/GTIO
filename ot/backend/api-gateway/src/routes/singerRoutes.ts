import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const singerRoutes = Router();

// Redirige todas las solicitudes de /api/singers al microservicio de cantantes
singerRoutes.use(
  '/',
  createProxyMiddleware({
    target: process.env.SINGER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/singers': '/api/singers',
    },
  })
);

export default singerRoutes;
