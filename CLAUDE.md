# Chabrin Agencies — Public Website

## Project Identity
Public-facing marketing and lead-generation website for Chabrin Agencies Limited,
a premier property management company in Nairobi, Kenya.

**Production URL:** https://chabrinagencies.com
**Hosting:** Dedicated DigitalOcean droplet (separate from CHIPS ERP droplet)
**GitHub:** https://github.com/Stan-Mash/chabrin-website

---

## ══ ZERO-TRUST MANDATE (NON-NEGOTIABLE) ══

**The website has ZERO connection to CHIPS (internal ERP).**

- Never write API calls to CHIPS or to `161.35.74.238`
- Never expose CHIPS database credentials or internal IDs
- Never add write-back logic to CHIPS from this website
- The website reads ONLY from `chabrin_public` PostgreSQL on its own droplet
- CHIPS pushes sanitized listing data outbound to `chabrin_public` on a schedule
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
| Database | PostgreSQL 16 via `postgres` (sql tagged template) |
| Forms | React Hook Form + Zod |
| Env validation | @t3-oss/env-nextjs — build fails if var missing |
| Image processing | sharp — EXIF/GPS strip before DO Spaces upload |
| Object storage | DigitalOcean Spaces (@aws-sdk/client-s3) |
| Bot protection | Cloudflare Turnstile (NOT reCAPTCHA) |
| Process manager | PM2 |
| Reverse proxy | Nginx + Let's Encrypt (Certbot) |
| CI/CD | GitHub Actions → SSH deploy to droplet |

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

2. **EXIF STRIPPING** — All image uploads MUST go through `src/lib/spaces.ts → uploadToSpaces()`.
   This strips GPS/EXIF via sharp before writing to DO Spaces.

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
│   ├── db.ts               # PostgreSQL singleton — server only
│   ├── spaces.ts           # DO Spaces upload with EXIF strip — server only
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

## Server & Deployment

**Droplet:** `165.227.138.108` (Ubuntu 22.04, 2 vCPU, 4GB RAM, 78GB disk)
**SSH:** `ssh deploy@165.227.138.108` or `ssh root@165.227.138.108`
**App path:** `/var/www/chabrin`
**Process manager:** PM2 (cluster mode, 2 instances)
**Web server:** Nginx → proxies `localhost:3000`
**SSL:** Let's Encrypt via Certbot (auto-renew, valid to Jul 2026)
**Database:** PostgreSQL 14, db: `chabrin_public`, user: `chabrin_web`

### Deploy command (after every push to main):
```bash
ssh deploy@165.227.138.108 "cd /var/www/chabrin && git pull origin main && npm ci && npm run build && pm2 reload chabrin-web"
```

### PM2 commands:
```bash
pm2 list                  # Show running processes
pm2 logs chabrin-web      # Tail app logs
pm2 reload chabrin-web    # Zero-downtime reload
pm2 restart chabrin-web   # Full restart
```

### First deploy checklist (pending — fill in as services are provisioned):
- [ ] DigitalOcean Spaces bucket created → update SPACES_* in .env.production
- [ ] Sanity.io project created → update SANITY_* in .env.production
- [ ] Cloudflare Turnstile site created → update TURNSTILE_* in .env.production
- [ ] Mapbox token obtained → update NEXT_PUBLIC_MAPBOX_TOKEN in .env.production
- [ ] Remove `SKIP_ENV_VALIDATION=1` from .env.production once all above are done
- [ ] Re-run `npm run build && pm2 reload chabrin-web` after each update
