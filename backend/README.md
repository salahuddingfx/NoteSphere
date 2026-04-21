# NoteSphere Backend

Express + MongoDB API for NoteSphere.

## Setup

1. Copy environment variables:
   - `cp .env.example .env` (or create `.env` manually on Windows)
2. Install dependencies:
   - `npm install`
3. Run development server:
   - `npm run dev`

## Core Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/notes`
- `POST /api/v1/notes` (multipart form-data with `file`)
- `PATCH /api/v1/notes/:id`
- `DELETE /api/v1/notes/:id`
- `POST /api/v1/notes/:id/like`
- `POST /api/v1/notes/:id/download`

## Production Notes

- Cookies are HTTP-only and set secure automatically in production.
- Add Cloudinary credentials before using upload endpoints.
- For production, tighten CORS origins and rate limits per infrastructure.
