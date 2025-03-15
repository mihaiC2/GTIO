import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const voteRoutes = Router();

// Redirige todas las solicitudes de /api/votes al microservicio de votos
voteRoutes.use(
  '/',
  createProxyMiddleware({
    target: process.env.VOTE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api/votes': '/api/votes',
    },
  })
);

export default voteRoutes;
