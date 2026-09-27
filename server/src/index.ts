import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyFormbody from '@fastify/formbody';
import dotenv from 'dotenv';
import { apiRoute } from './routes/v1Route.js';

dotenv.config();

const app = Fastify({ logger: true });
const PORT = Number(process.env.PORT) || 7860;

// Enable CORS allowing your Cloudflare Worker / Client
app.register(cors, {
  origin: process.env.CLIENT_URL || true,
});

app.register(fastifyFormbody);

// Root health check endpoint
app.get('/', async (request, reply) => {
  reply.type('application/json').code(200);
  return { status: 'online', message: 'Movie API Server Running' };
});

// Register API routes
app.register(apiRoute, { prefix: '/api' });

// Catch-all 404 handler with logging so you see unmatched requests in Hugging Face logs
app.setNotFoundHandler((request, reply) => {
  console.log(`[HF BACKEND 404] Route not found: ${request.method} ${request.url}`);
  reply.status(404).send({ error: `Route ${request.method} ${request.url} not found` });
});

app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
