# Chabrin Agencies — Public Website

## Project Identity
Public-facing marketing and lead-generation website for Chabrin Agencies Limited,
a premier property management company in Nairobi, Kenya.

**Production URL:** https://chabrinagencies.com
**Hosting:** Vercel (auto-deploy from `main` branch)
**Database:** Neon serverless PostgreSQL
**GitHub:** https://github.com/Stan-Mash/chabrin-website

---

## ══ ZERO-TRUST MANDATE (NON-NEGOTIABLE) ══

**The website has ZERO connection to CHIPS (internal ERP).**

- Never write API calls to CHIPS or to `161.35.74.238`
- Never expose CHIPS database credentials or internal IDs
- Never add write-back logic to CHIPS from this website
- The website reads ONLY from the Neon database (`chabrin_public` schema)
- CHIPS pushes sanitized listing data outbound to Neon on a schedule
- The sync is one-way: CHIPS → website DB. Never the reverse.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Language | TypeScript — strict mode, no implicit any |
| Styling | Tailwind CSS 4 |
| UI | shadcn/ui |
| i18n | next-intl — locales: `en` (English), `sw` (Swahili) |
| CMS | Sanity.io — blog, careers, team, page content |
| Database | Neon serverless PostgreSQL via `postgres` (sql tagged template) |
| Forms | React Hook Form + Zod |
| Env validation | @t3-oss/env-nextjs — build fails if var missing |
| Image processing | sharp — EXIF/GPS strip before Vercel Blob upload |
| Object storage | Vercel Blob (`@vercel/blob`) |
| Bot protection | Cloudflare Turnstile (NOT reCAPTCHA) |
| Hosting | Vercel (auto-deploy on push to `main`) |
| CI/CD | Git push to `main` → Vercel auto-build & deploy |

---

## Brand Tokens (EXACT — do not alter)

```
Brand Navy: #0D1B8E  — headings, nav, primary backgrounds
Brand Cyan: #00C9C9  — CTAs, highlights, "LIMITED" wordmark, roof accent
Font:       Plus Jakarta Sans (Google Fonts — approved commercial licence)
```

Logo files live at `/public/logo-icon.png` and `/public/logo-wordmark.png`.

---

## Kenya Legal & Compliance Rules

1. **NO EXACT ADDRESSES** — Never render GPS coordinates, LR numbers, or landlord names.
   Render `zone` and `area` only (KRA eRITS protection).

2. **EXIF STRIPPING** — All image uploads MUST go through `src/lib/spaces.ts → uploadToBlob()`.
   This strips GPS/EXIF via sharp before writing to Vercel Blob.

3. **CLOUDFLARE TURNSTILE ONLY** — All forms use Turnstile. Never add Google reCAPTCHA
   (KDPA cross-border data transfer violation risk).

4. **NO PII LOGGING** — Never `console.log` lead data, email addresses, or phone numbers.

5. **KDPA CONSENT** — All forms must include a consent checkbox linking to `/privacy-policy`.
   `consentGiven: true` is required before form submission.

6. **ODPC** — Office of the Data Protection Commissioner registration in progress.
   Privacy Policy page is mandatory and must be live at launch.

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   └── [locale]/           # next-intl locale routing (en/sw)
├── components/
│   ├── ui/                 # shadcn/ui base components
│   ├── layout/             # Navbar, Footer, PageWrapper
│   ├── sections/           # Hero, PropertyGrid, ServicesGrid, etc.
│   └── forms/              # ContactForm, EnquiryForm (Turnstile)
├── lib/
│   ├── db.ts               # Neon PostgreSQL client — server only
│   ├── spaces.ts           # Vercel Blob upload with EXIF strip — server only
│   └── sanity.ts           # Sanity CMS client
├── db/
│   └── queries/            # SQL query functions (typed)
├── actions/                # Next.js Server Actions
├── sanity/
│   ├── schemas/            # Sanity content schemas
│   └── queries/            # GROQ query strings
├── locales/
│   ├── en.json             # English translations
│   └── sw.json             # Swahili translations
├── i18n/
│   └── request.ts          # next-intl config
├── types/
│   └── index.ts            # Shared TypeScript types
├── config/
│   └── site.ts             # Global site config (URL, contact, social)
└── env.ts                  # @t3-oss/env-nextjs schema
```

---

## What is Strictly Forbidden

- Never import CHIPS DB credentials or CHIPS internal URLs
- Never `console.log` lead data, emails, phone numbers, or DB rows with PII
- Never use Google reCAPTCHA (use Cloudflare Turnstile)
- Never render exact property addresses, GPS coords, or LR numbers
- Never show landlord names in any public-facing output
- Never commit `.env` files of any kind
- Never add `Co-Authored-By:` or AI attribution in git commit messages
- Never write directly to `chabrin_public` from website code (writes come from CHIPS sync only)
- Never use native float arithmetic for KES amounts

---

## Development Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build (validates env vars)
npm run lint         # ESLint check
```

## Machine (Work Desktop)
- Node: `C:\nodejs\node-v22.14.0-win-x64`
- PATH prefix needed: `PATH="/c/nodejs/node-v22.14.0-win-x64:$PATH"`

---

## Hosting & Deployment

**Platform:** Vercel
**Deploy trigger:** Push to `main` → Vercel auto-builds and deploys
**No SSH, no PM2, no Nginx required.**

To deploy any change:
```bash
git push origin main   # Vercel picks it up automatically
```

To check build logs: Vercel Dashboard → chabrin-website → Deployments

### Database — Neon
- **Project:** Neon Dashboard → chabrin-website project
- **Connection:** Use the **Pooled** connection string (host ends in `-pooler.<region>.aws.neon.tech`)
- **Env var:** `DATABASE_URL` — set in Vercel Dashboard → Settings → Environment Variables
- SSL is always required by Neon (`sslmode=require` in connection string)
- `prepare: false` is set in `db.ts` for PgBouncer compatibility

### Environment variables (set in Vercel Dashboard, NOT in files)
| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Neon Dashboard → Connection Details → Pooled |
| `BLOB_READ_WRITE_TOKEN` | Vercel Dashboard → Storage → Blob |
| `SANITY_API_TOKEN` | Sanity Dashboard → API → Tokens |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity Dashboard → Project settings |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare → Turnstile |
| `TURNSTILE_SECRET_KEY` | Cloudflare → Turnstile |
| `SMTP_HOST / SMTP_USER / SMTP_PASS` | Your email provider |
| `ADMIN_PASSWORD` | Generate: `openssl rand -base64 24` |
| `ADMIN_SESSION_SECRET` | Generate: `openssl rand -base64 32` |
