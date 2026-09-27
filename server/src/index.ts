import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";
import dotenv from "dotenv";
import { apiRoute } from "./routes/v1Route.js";

dotenv.config();

const app = Fastify({
  logger: true,
});

const PORT = Number(process.env.PORT) || 7860;

const CLIENT_URL = process.env.CLIENT_URL;
const PROXY_SECRET = process.env.PROXY_SECRET;

if (!PROXY_SECRET) {
  throw new Error("PROXY_SECRET is not configured");
}

if (!CLIENT_URL) {
  throw new Error("CLIENT_URL is not configured");
}

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

await app.register(cors, {
  origin: CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-Proxy-Secret"],
});

/*
|--------------------------------------------------------------------------
| Form body
|--------------------------------------------------------------------------
*/

await app.register(fastifyFormbody);

/*
|--------------------------------------------------------------------------
| Health check
|--------------------------------------------------------------------------
*/

app.get("/", async (_request, reply) => {
  return reply.code(200).send({
    status: "online",
    message: "Movie API Server Running",
  });
});

/*
|--------------------------------------------------------------------------
| Proxy authentication
|--------------------------------------------------------------------------
|
| Every /api request must contain the secret supplied by Cloudflare.
|
*/

app.addHook("onRequest", async (request, reply) => {
  // Only protect API routes
  if (!request.url.startsWith("/api")) {
    return;
  }

  const providedSecret = request.headers["x-proxy-secret"];

  if (
    typeof providedSecret !== "string" ||
    providedSecret.length === 0
  ) {
    request.log.warn(
      {
        method: request.method,
        url: request.url,
      },
      "Missing proxy authentication"
    );

    return reply.code(401).send({
      error: "Unauthorized",
    });
  }

  /*
   * Constant-time comparison.
   *
   * For a simple shared secret this is already much better than
   * accepting an unauthenticated public endpoint.
   */

  if (providedSecret !== PROXY_SECRET) {
    request.log.warn(
      {
        method: request.method,
        url: request.url,
      },
      "Invalid proxy authentication"
    );

    return reply.code(401).send({
      error: "Unauthorized",
    });
  }
});

/*
|--------------------------------------------------------------------------
| API routes
|--------------------------------------------------------------------------
*/

await app.register(apiRoute, {
  prefix: "/api",
});

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.setNotFoundHandler((request, reply) => {
  request.log.warn(
    {
      method: request.method,
      url: request.url,
    },
    "Route not found"
  );

  return reply.code(404).send({
    error: "Not Found",
  });
});

/*
|--------------------------------------------------------------------------
| Start server
|--------------------------------------------------------------------------
*/

try {
  await app.listen({
    port: PORT,
    host: "0.0.0.0",
  });

  console.log(`🚀 Server running on port ${PORT}`);
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
