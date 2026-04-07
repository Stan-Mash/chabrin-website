# Chabrin Agencies Limited — Public Website

Public-facing marketing and lead-generation website for **Chabrin Agencies Limited**,
a premier property management company in Nairobi, Kenya.

**Production:** https://chabrinagencies.com
**Stack:** Next.js 15 · TypeScript · Tailwind CSS 4 · PostgreSQL 16 · Sanity CMS

---

## Zero-Trust Architecture

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│   CHIPS Droplet (private)   │        │   Website Droplet (public)   │
│   161.35.74.238             │        │   chabrinagencies.com        │
│                             │        │                              │
│   Laravel 11 (CHIPS ERP)    │─push──▶│   Next.js 15 (this repo)    │
│   PostgreSQL (CHIPS DB)     │  60min │   PostgreSQL chabrin_public  │
│   Sync scheduler            │        │   Nginx + PM2                │
│                             │        │   Let's Encrypt SSL          │
│   Firewall: inbound SSH     │        │                              │
│   from known IPs only       │        │   Port 5432 open to CHIPS IP │
└─────────────────────────────┘        │   Port 443 open via CF only  │
                                       └──────────────────────────────┘
                                                     │
                                       ┌─────────────▼──────────────┐
                                       │   Cloudflare (free)        │
                                       │   DNS proxy · DDoS shield  │
                                       │   Turnstile (forms)        │
                                       └────────────────────────────┘
```

**The website has ZERO connection to CHIPS.** Data flows one-way only:
CHIPS → website database. The website never connects to CHIPS.

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 (App Router) | Server Components, Server Actions, ISR |
| Language | TypeScript (strict) | Type safety across all layers |
| Styling | Tailwind CSS 4 | Utility-first, mobile-first |
| UI | shadcn/ui | Accessible component primitives |
| i18n | next-intl | English + Swahili locale routing |
| CMS | Sanity.io | Blog, careers, team, page content |
| Database | PostgreSQL 16 + postgres | Public listings (read-only from website) |
| Forms | React Hook Form + Zod | Strict validation with schema |
| Env | @t3-oss/env-nextjs | Build-time env var validation |
| Images | sharp + DO Spaces | EXIF strip + CDN delivery |
| Bot protection | Cloudflare Turnstile | KDPA-safe form protection |
| Hosting | DigitalOcean + PM2 + Nginx | Self-hosted, full control |
| CI/CD | GitHub Actions | Auto-deploy on push to main |

---

## Local Setup

### Prerequisites
- Node.js 22+
- PostgreSQL 16 (local instance)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Stan-Mash/chabrin-website.git
cd chabrin-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your local values
```

### 4. Set up local database
```bash
createdb chabrin_public -U postgres
```

### 5. Start development server
```bash
npm run dev
# Open http://localhost:3000
```

---

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (website DB only — NOT CHIPS) |
| `SPACES_KEY` / `SPACES_SECRET` | DigitalOcean Spaces credentials |
| `SANITY_API_TOKEN` | Sanity read token (server-side only) |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret (server-side only) |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL JS public token |

---

## Deployment (DigitalOcean)

Deployments are automated via GitHub Actions on push to `main`.

**Manual deploy:**
```bash
ssh deploy@<website-droplet-ip>
cd /var/www/chabrin-website
git pull origin main
npm ci --omit=dev
npm run build
pm2 reload chabrin-website
```

---

## Folder Structure

```
src/
├── app/[locale]/           # Pages — locale-prefixed routes
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Page sections (Hero, Grid, etc.)
│   └── forms/              # Lead capture forms (Turnstile)
├── lib/
│   ├── db.ts               # PostgreSQL singleton (server only)
│   ├── spaces.ts           # DO Spaces + EXIF strip (server only)
│   └── sanity.ts           # Sanity CMS clients
├── db/queries/             # Typed SQL query functions
├── actions/                # Server Actions
├── sanity/                 # CMS schemas + GROQ queries
├── locales/                # en.json + sw.json translations
├── i18n/                   # next-intl request config
├── types/                  # Shared TypeScript types
├── config/                 # Site config
└── env.ts                  # Env var schema
```

---

## Kenya Legal & Compliance

| Requirement | Status | Notes |
|-------------|--------|-------|
| ODPC Registration | In progress | KES 4,000 fee, ~14 working days |
| KRA eRITS compliance | Implemented | Zone/area only — no exact addresses |
| KDPA consent | Implemented | Consent checkbox on all forms |
| EXIF stripping | Implemented | Via sharp before DO Spaces upload |
| Privacy Policy | Required before launch | /privacy-policy page |

---

## Licence

Proprietary — Chabrin Agencies Limited. All rights reserved.
