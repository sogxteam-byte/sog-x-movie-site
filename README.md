# SOG-X Movie Site

A full-stack movie discovery app. Browse, search, and view details/trailers for movies, powered by [TMDB](https://www.themoviedb.org/). Built as a monorepo with a React frontend and a Fastify API backend, deployed independently.

- **Live app:** [https://soflix.sogx.top](https://soflix.sogx.top)
- **API:** deployed as a Docker container on Hugging Face Spaces

## ✨ Features

- 🎬 Browse popular movies
- 🔍 Search movies by title
- 🆔 View full details for a single movie
- 🎞️ Watch trailers
- 🔐 CORS-locked API, origin-restricted to the deployed frontend

## 🛠️ Tech Stack

**Frontend (`client/`)**
- [Vite](https://vitejs.dev/) + React + TypeScript
- Tailwind CSS
- Axios for API calls
- Deployed on [Vercel](https://vercel.com/)

**Backend (`server/`)**
- Node.js 20 + TypeScript
- [Fastify](https://fastify.dev/)
- Axios (TMDB API client)
- Deployed via Docker on [Hugging Face Spaces](https://huggingface.co/spaces)

## 📁 Project Structure

```
sog-x-movie-site/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # MovieCard, MovieId, search
│   │   ├── pages/               # home
│   │   ├── services.ts          # API client (axios)
│   │   └── App.tsx
│   └── vercel.json
│
└── server/                     # Fastify API backend
    ├── src/
    │   ├── index.ts             # App entry point (Fastify, CORS, server start)
    │   ├── routes/
    │   │   └── v1Route.ts       # /api route definitions
    │   ├── storage/
    │   │   └── movies.ts        # TMDB API integration
    │   └── models/
    │       └── moviesModel.ts   # Shared TypeScript types
    └── package.json
```

## 🔌 API Endpoints

All endpoints are mounted under `/api`.

| Method | Endpoint            | Description                | Query Params  |
|--------|----------------------|------------------------------|-----------------|
| GET    | `/api/movies`         | List popular movies         | —               |
| GET    | `/api/search`         | Search movies by title      | `text` (string) |
| GET    | `/api/movie`           | Get a single movie by ID    | `id` (string)   |
| GET    | `/api/movie/trailer`   | Get trailer(s) for a movie  | `id` (string)   |

**Example:**

```bash
curl "https://your-deployed-api.hf.space/api/search?text=inception"
```

## ⚙️ Environment Variables

Never commit real values — both `client/` and `server/` already `.gitignore` their `.env` files.

**`server/.env`**

| Variable      | Description                                   | Required |
|----------------|-------------------------------------------------|----------|
| `PORT`          | Port the server listens on (defaults to `3000`) | No       |
| `CLIENT_URL`    | Allowed origin for CORS (your frontend's URL)   | Yes      |
| `TMDB_API`      | Your [TMDB](https://www.themoviedb.org/settings/api) API read-access token | Yes |

**`client/.env`**

| Variable        | Description                                 | Required |
|------------------|------------------------------------------------|----------|
| `VITE_BACKEND`    | Base URL of the deployed API                  | Yes       |
| `VITE_TOKEN`      | Bearer token sent with API requests (reserved for future backend auth — not currently validated server-side) | No |

## 🚀 Getting Started (Local Development)

```bash
git clone https://github.com/gfathertech/sog-x-movie-site.git
cd sog-x-movie-site
```

**Backend:**

```bash
cd server
npm install
cp .env.example .env   # fill in TMDB_API and CLIENT_URL
npm run dev             # dev server with hot reload
# or
npm run build && npm start   # production build
```

**Frontend:**

```bash
cd client
npm install
cp .env.example .env   # fill in VITE_BACKEND
npm run dev
```

## 🐳 Docker Deployment (Backend)

The backend is deployed via a Dockerfile that:

1. Clones the repository (using a securely mounted build-time secret, not a plain build arg)
2. Copies only the `server/` folder
3. Installs dependencies and compiles TypeScript
4. Runs the compiled app from `dist/`

This Dockerfile currently lives at the Hugging Face Space level (not in this repository) and is written specifically for Hugging Face Spaces' secret-mounting conventions — it isn't drop-in portable to other hosting platforms without adjustment. Hugging Face is being used as the deployment target for now while the backend is developed further.

If setting this up on your own Space:
- Add your GitHub token as a **Secret** (not a Variable) named `GH_TOKEN` if the repo is private.
- Add `CLIENT_URL` and `TMDB_API` as runtime **Variables/Secrets** in the Space's settings.

## 🧩 Issues Resolved

* Docker build failing — GitHub token not passing through as a build arg on Hugging Face Spaces, fixed using BuildKit secret mounts ( September 2026 )
* GitHub clone rejected — fine-grained token missing correct repo scope, fixed by re-scoping the token ( September 2026 )
* API crashing on every request — CORS origin misconfigured from a missing env var, fixed with proper runtime config + safe fallback ( September 2026 )

## 🤝 Contributing

Issues and pull requests are welcome. Please avoid including any real credentials, tokens, or `.env` files in commits or PRs.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).
