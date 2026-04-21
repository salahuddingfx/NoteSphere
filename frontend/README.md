# NoteSphere Frontend

Next.js 14 frontend for the NoteSphere platform.

## Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Framer Motion
- Axios
- Zustand
- React Hook Form

## Setup

1. Create environment file:
	- Copy `.env.example` to `.env.local`
2. Install dependencies:
	- `npm install`
3. Start development server:
	- `npm run dev`

App runs at `http://localhost:3000`.

## Environment

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1`

## Included Foundations

- Auth screens (Register/Login)
- Zustand auth session store
- HTTP-only cookie auth flow integration
- Protected dashboard route
- Cinematic dark-mode landing page
