import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import dotenv from 'dotenv';
import { apiRoute } from './routes/v1Route.js';

dotenv.config();

const app = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 7860;

// Enable CORS
app.register(cors, {
  origin: process.env.CLIENT_URL || true,
});

app.register(fastifyFormbody);

// Security Middleware: Block requests that bypass Cloudflare Worker
app.addHook('onRequest', async (request, reply) => {
  // Allow health check endpoint to pass without secret
  if (request.url === '/health' || request.url === '/') {
    return;
  }

  const proxySecret = request.headers['x-proxy-secret'];
  const expectedSecret = process.env.PROXY_SECRET;

  if (expectedSecret && proxySecret !== expectedSecret) {
    reply.status(403).send({ error: 'Access denied: Direct access to backend is restricted.' });
  }
});

app.get('/', async (request, reply) => {
  reply.type('application/json').code(200);
  return { status: 'online', message: 'Movie API Server Running' };
});

app.register(apiRoute, { prefix: '/api' });

app.setNotFoundHandler((request, reply) => {
  // Add this line to force Fastify to print unmatched incoming requests:
  console.log(`[HF BACKEND RECEIVED] Unmatched route: ${request.method} ${request.url}`);
  
  reply.status(404).send({ error: 'Not Found' });
});

app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
