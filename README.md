# NoteSphere

The Universal Academic Note-Sharing Vault

Agency: Nextora Studio  
Lead Developer: Salah Uddin Kader

## Monorepo Structure

- frontend: Next.js 14 app
- backend: Express + MongoDB API

## Quick Start

1. Backend setup
   - Go to `backend`
   - Copy `.env.example` to `.env`
   - Set MongoDB and JWT values
   - Run `npm install`
   - Run `npm run dev`
2. Frontend setup
   - Go to `frontend`
   - Copy `.env.example` to `.env.local`
   - Run `npm install`
   - Run `npm run dev`

## Phase 1 Delivered

- Project foundation for frontend + backend
- Secure auth (register/login/logout/current user)
- JWT + HTTP-only cookie auth
- Password hashing and role-ready middleware
- User model with gamification fields
- Core note model and initial upload/feed CRUD APIs

## Next Recommended Implementation Wave

- Comment and reply system
- Request-note module with upvote sorting
- Bookmark collection pages
- XP events + rank engine + leaderboard
- Admin dashboard moderation routes
- SEO expansion with dynamic note pages and sitemap
