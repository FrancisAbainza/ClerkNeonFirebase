## Clerk + Neon + Firebase Starter

Modern Next.js starter featuring:

- Authentication with Clerk
- Postgres on Neon with Drizzle ORM
- File uploads with Firebase Storage (Admin SDK)
- UI built with shadcn/ui and Tailwind CSS

The app ships with a minimal posts dashboard: create, update, and delete posts with multiple images. Images are stored in Firebase Storage; image paths are stored in Postgres.

### Tech stack

- Next.js 15 (App Router), React 19, TypeScript
- Clerk for auth (`@clerk/nextjs`)
- Neon Postgres + Drizzle ORM (`drizzle-orm`, `@neondatabase/serverless`)
- Firebase Admin SDK for Storage
- Tailwind CSS v4, shadcn/ui, Radix UI

### Features

- Auth-ready layout and middleware
- Posts CRUD using Drizzle ORM
- Multi-image upload with drag & drop
- API endpoints for upload, delete files, and serve files
- Clean UI with shadcn/ui components

## Quick start

1) Install dependencies

```bash
npm install
```

2) Configure environment variables in `.env.local`

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Database (Neon Postgres)
DATABASE_URL=postgres://USER:PASSWORD@HOST:PORT/DB?sslmode=require

# Firebase Admin (Service Account)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=service-account@your-project-id.iam.gserviceaccount.com
# Keep quotes; newlines must be \n
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

3) Generate and apply database migrations (Drizzle)

```bash
# Generate SQL from schema changes
npx drizzle-kit generate

# Apply migrations to the database
npx drizzle-kit push

# Optional: open Drizzle Studio
npx drizzle-kit studio
```

4) Run the dev server

```bash
npm run dev
```

Open `http://localhost:3000`. Create an account via the Clerk modal and navigate to the dashboard.

## Project structure (selected)

```text
src/
  app/
    api/
      upload/route.ts          # Upload files to Firebase Storage
      delete/route.ts          # Delete files by path
      delete-folder/route.ts   # Delete an entire folder prefix
      files/[...path]/route.ts # Serve files from Storage
    dashboard/                 # Posts UI + server actions
  components/                  # UI + form components (shadcn/ui)
  db/
    db.ts                      # Drizzle + Neon connection
    schema.ts                  # Drizzle schema (posts)
  lib/
    firebase-server.ts         # Firebase Admin initialization
    validation/                # Zod schemas
  middleware.ts                # Clerk middleware
```

## Database

Drizzle schema is defined in `src/db/schema.ts`. Connection is configured via `DATABASE_URL` in `src/db/db.ts` using the Neon serverless driver.

Common commands:

```bash
npx drizzle-kit generate   # create SQL migrations from schema
npx drizzle-kit push       # apply migrations
npx drizzle-kit studio     # browse DB locally
```

## Routes and APIs

- `POST /api/upload`
  - FormData: `id` (number), `folderName` (string), `files` (File[]) → returns array of stored paths
- `DELETE /api/delete`
  - FormData: `paths` (string[]) → deletes specific files
- `DELETE /api/delete-folder`
  - JSON: `{ folderPath: string }` → deletes all files under prefix
- `GET /api/files/[...path]`
  - Streams file bytes from Firebase Storage (`Cache-Control` set for long-term caching)

Dashboard pages call Next.js Server Actions in `src/app/dashboard/actions.ts` to perform CRUD via Drizzle.

## Authentication

- Clerk is initialized in `src/middleware.ts` and `src/app/layout.tsx`
- Public landing page redirects authenticated users to `/dashboard`
- Protect additional routes using Clerk as needed

## UI

- Components are from shadcn/ui (see `src/components/ui`)
- Tailwind CSS v4 is preconfigured in `src/app/globals.css`

## Deployment

Deploy on Vercel.

1) Add all required environment variables in the Vercel project settings
2) Set `DATABASE_URL` to your Neon connection string (require SSL)
3) Provide Clerk keys and Firebase Admin credentials
4) Trigger a build

## Scripts

```bash
npm run dev     # start development server
npm run build   # build for production
npm run start   # start production server
npm run lint    # run Next.js ESLint
```

## Notes

- Ensure your Firebase service account has access to the Storage bucket specified by `FIREBASE_STORAGE_BUCKET`
- For local development, the Firebase private key must keep literal `\n` newlines as shown above
- Image URLs are served via the internal `GET /api/files/...` route for type-safe access and caching

