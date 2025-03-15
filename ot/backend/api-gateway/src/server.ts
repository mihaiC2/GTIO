import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar proxy para cada microservicio
app.use('/api/auth', createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL || 'http://localhost:5000',
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
        if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    }
}));

app.use('/api/singers', createProxyMiddleware({
    target: process.env.SINGER_SERVICE_URL || 'http://localhost:5001',  // Dirección del microservicio de singers
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
      }
    }
  }));

app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://localhost:5002',  // Dirección del microservicio de users
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
        if (req.body) {
            const bodyData = JSON.stringify(req.body);
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
        }
    }
}));

app.use('/api/votes', createProxyMiddleware({
  target: process.env.VOTE_SERVICE_URL || 'http://localhost:5003',  // Dirección del microservicio de votes
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    }
  }
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
