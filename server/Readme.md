# SOG-X Movie Site — Backend API

A lightweight movie catalog API built with **Fastify** and **TypeScript**, serving movie listings, search, details, and trailer data to a separate frontend client. Deployed as a Docker container on Hugging Face Spaces.

## ✨ Features

- 🎬 Browse movies
- 🔍 Search movies by title
- 🆔 Fetch a single movie by ID
- 🎞️ Fetch trailers for a movie
- 🔐 CORS-locked to a configured client origin
- 🐳 Containerized deployment (Docker)

## 🛠️ Tech Stack

- **Runtime:** Node.js 20
- **Framework:** [Fastify](https://fastify.dev/)
- **Language:** TypeScript
- **HTTP client:** Axios
- **Env management:** dotenv
- **Deployment:** Docker → Hugging Face Spaces

## 📁 Project Structure

This repository is a monorepo. Only the `server/` folder is built and deployed as the API — everything else (frontend client, etc.) is developed separately.

```
repo/
└── server/
    ├── routes/
    │   └── v1Route.js       # API route definitions
    ├── storage/
    │   └── movies.js        # Data-fetching logic (movies, search, trailers)
    ├── index.ts              # App entry point (Fastify setup, CORS, server start)
    ├── package.json
    └── tsconfig.json
```

## 🔌 API Endpoints

All endpoints are mounted under the `/api` prefix.

| Method | Endpoint            | Description                          | Query Params   |
|--------|----------------------|---------------------------------------|-----------------|
| GET    | `/api/movies`         | List all movies                       | —                |
| GET    | `/api/search`         | Search movies by title                | `text` (string)  |
| GET    | `/api/movie`           | Get a single movie by ID              | `id` (string)    |
| GET    | `/api/movie/trailer`   | Get trailer(s) for a movie            | `id` (string)    |

**Example:**

```bash
curl "https://your-deployed-api.hf.space/api/search?text=inception"
```

## ⚙️ Environment Variables

This project uses environment variables for configuration. **Never commit real values to the repository** — a `.env.example` file is provided as a template; copy it to `.env` locally and fill in your own values.

```bash
cp .env.example .env
```

| Variable      | Description                                                        | Required |
|----------------|---------------------------------------------------------------------|----------|
| `PORT`          | Port the server listens on (defaults to `3000` locally)            | No       |
| `CLIENT_URL`    | Allowed origin for CORS (your frontend's URL)                      | Yes      |
| `TMDB_API_KEY`  | *(or whichever movie-data provider you use)* — API key for fetching movie data | Yes |

> ⚠️ **Security note:** `.env` is included in `.gitignore` and should never be pushed to the repository. If you're deploying to Hugging Face Spaces, set these as **Variables/Secrets** in your Space's Settings tab instead of committing them anywhere.

## 🚀 Getting Started (Local Development)

```bash
# Clone the repo
git clone https://github.com/gfathertech/sog-x-movie-site.git
cd sog-x-movie-site/server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# then edit .env with your own values

# Run in development
npm run dev

# Or build and run production
npm run build
npm start
```

The server will be available at `http://localhost:3000` (or whatever `PORT` you set).

## 🐳 Docker Deployment

This project is deployed via Docker to Hugging Face Spaces. The Dockerfile:

1. Clones the repository
2. Copies only the `server/` folder
3. Installs dependencies and builds the TypeScript source
4. Runs the compiled app from `dist/`

If you're setting this up on your own Hugging Face Space:

- Add your GitHub token as a **Secret** (not a Variable) named `GH_TOKEN` — required at build time to clone a private repo, and mounted securely rather than baked into the image.
- Add `CLIENT_URL` and any data-provider API keys as **Variables/Secrets** as appropriate — these are needed at runtime.

## 🤝 Contributing

Issues and pull requests are welcome. Please avoid including any real credentials, tokens, or `.env` files in commits or PRs.

📄 License

This project is licensed under the MIT License — you're free to use, modify, and distribute it, provided the original copyright notice is retained.
