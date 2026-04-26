Product Management System — Setup Guide

Overview

This adds a full Product Management System to the Admin Dashboard using Next.js (App Router), TypeScript, Tailwind CSS, MongoDB (for product metadata) and Supabase Storage (for product images).

What was added

- API routes (server):
  - `app/api/products/route.ts`        — GET list, POST create
  - `app/api/products/[id]/route.ts`   — PUT update, DELETE remove
- Supabase client helper:
  - `lib/supabaseClient.ts`
- Admin UI (client):
  - `app/admin/dashboard/products/page.tsx`       — server wrapper (checks admin cookie)
  - `app/admin/dashboard/products/ProductsClient.tsx` — client page orchestration
  - `app/admin/dashboard/products/ProductForm.tsx`    — add / edit form (image upload to Supabase Storage)
  - `app/admin/dashboard/products/ProductList.tsx`    — product list with edit/delete
- Small change: header link to `Products` added in `app/admin/dashboard/DashboardClient.tsx`.

Environment variables (add to `.env.local`)

- `MONGODB_URI` — your MongoDB connection string (already used by the project)
- `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL (example present in repo)
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase anon/public key

Supabase Storage setup

1. Sign in to your Supabase project.
2. Open "Storage" → Create a new bucket named `product-images`.
   - Make it PUBLIC (or configure a public URL policy) so uploaded images return a usable URL.
3. No special server-side key is required because uploads happen from the browser using the public key.

Notes on security: the admin API routes are protected by the `admin-auth` cookie used elsewhere in this project. Only users who obtain that cookie (the admin login flow) can call the API.

How the flow works (high-level)

- Admin logs in via `/admin/login` (existing in your project) — cookie `admin-auth=true` is set.
- Admin navigates to `/admin/dashboard/products`.
- The page (server wrapper) checks cookie; if not present, redirects to `/admin/login`.
- On the client, the product form uploads image directly to Supabase Storage, obtains a public URL, then sends product metadata (including `image` URL) to our MongoDB-backed API routes.
- Product list fetches via `GET /api/products`.

Commands to run locally

Install new dependency and build:

```bash
npm install
npm run build
```

Start dev server:

```bash
npm run dev
```

Open in browser: http://localhost:3000/admin/dashboard/products

Folder structure (relevant files)

- `lib/supabaseClient.ts`
- `app/api/products/route.ts`
- `app/api/products/[id]/route.ts`
- `app/admin/dashboard/products/page.tsx`
- `app/admin/dashboard/products/ProductsClient.tsx`
- `app/admin/dashboard/products/ProductForm.tsx`
- `app/admin/dashboard/products/ProductList.tsx`
- `app/admin/dashboard/DashboardClient.tsx` (link added)

Where to paste each file

- Files under `app/api` go into the `app/api` folder in your repo (already added).
- UI files go under `app/admin/dashboard/products/`.
- `lib/supabaseClient.ts` goes in the `lib/` folder.

Validation and errors

- The server validates that `name`, `description`, `price`, `category`, and `image` are present when creating a product.
- API responses use standard HTTP status codes and JSON `{ error }` messages.

Tips & Next steps

- If you prefer server-side image uploads (instead of client uploads to Supabase), the API routes can be extended to accept `multipart/form-data` and forward files to Supabase or Cloudinary.
- For stricter access control, replace the `admin-auth` cookie with a proper NextAuth session + middleware that checks session/role.

If you want, I can:

- Run `npm run dev` and manually test the flows and show screenshots of the UI.
- Help you create the Supabase bucket (I can't create it for you, but I can provide exact CLI/API commands).

