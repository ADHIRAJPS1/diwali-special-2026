# Green Diwali campaign

A responsive Next.js campaign site with a screen-only celebration animation, a server-backed unique visitor counter, and an optional private wish form.

## Run locally

1. Install Node.js 18.17 or later.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env.local` and set the Supabase values below.
4. Run the SQL in `supabase/schema.sql` in your Supabase project's SQL editor.
5. Start with `npm run dev` and open the local address printed by Next.js.

The campaign page still renders without credentials. The counter and form clearly report unavailable until a database is configured; no fake local-only count is shown.

## Supabase configuration

Create a Supabase project and set:

- `NEXT_PUBLIC_SUPABASE_URL`: project URL (public project URL only).
- `SUPABASE_SERVICE_ROLE_KEY`: service role key. This value is only accessed inside server routes; keep it in deployment secrets and never expose it in client code.

The `celebrations` table stores only a SHA-256 hash of a random, HTTP-only, same-site visitor cookie. Its primary key makes repeat clicks count once per browser cookie. The RPC inserts idempotently; `celebration_totals` exposes only the aggregate to the API. Clearing cookies or using another browser/device creates another unique celebration. This is a campaign counter, not a verified person count.

Participant messages and opted-in fields are stored in `participant_messages`, protected by row-level security with no public policies. The server API uses the service role to insert; there is no public read route. Form submission is explicit and requires consent. Name, phone, email and age are optional; age is limited to adults (18+). Establish an organiser access and retention/deletion process before launch. The notice describes the implemented handling, but should be reviewed to match your organisation and applicable privacy requirements.

## Deploy

Deploy this folder as a Next.js project on Vercel or another Node.js host. Add the two environment variables as server deployment secrets, run `supabase/schema.sql` once, and deploy. Use HTTPS in production. The visitor cookie is HTTP-only, same-site, secure in production, and lasts one year. The project does not bundle analytics or expose personal submissions publicly.

## Safety

The interactive celebration is a CSS confetti effect and on-screen message. It contains no real fireworks, explosive imagery, sound, or instructions.
