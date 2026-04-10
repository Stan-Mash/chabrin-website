# Chabrin Agencies Website — Improvement Analysis

## Executive Summary
The website has a solid foundation with modern tech stack (Next.js 15, TypeScript, Tailwind CSS 4), strong security infrastructure (zero-trust CHIPS separation, EXIF stripping, Turnstile), and excellent Kenya-compliant architecture. Below are prioritized improvements across performance, features, SEO, and maintainability.

---

## 🚨 CRITICAL (Security & Compliance)

### 1. **Turnstile Token Handling in ContactForm**
**Priority:** HIGH  
**Issue:** ContactForm doesn't capture Turnstile token before sending to API.
```typescript
// Currently missing:
const token = window.cf?.turnstile?.getResponse();
// Then add token to form data before POST
```
**Impact:** Bot protection disabled.  
**Fix Time:** 30 minutes  
**Files:**
- `src/components/sections/contact/ContactForm.tsx` — Add Turnstile widget hook integration
- Reference: [@marsidev/react-turnstile](https://www.npmjs.com/package/@marsidev/react-turnstile)

### 2. **ContactForm Missing Privacy Policy Link**
**Issue:** Consent checkbox doesn't link to `/privacy-policy`.  
**KDPA Requirement:** Privacy Policy link is mandatory in forms.  
**Fix:** Add `href` to the checkbox label → `/privacy-policy`

### 3. **Email Delivery Not Configured**
**Issue:** Contact enquiries are only logged to stdout, not emailed to `info@chabrinagencies.com`.  
**Impact:** Leads may be missed if PM2 logs aren't monitored.  
**Solution:** Add nodemailer integration:
```bash
npm install nodemailer @types/nodemailer
```
Add `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` to `.env`.  
**Files to create:** `src/actions/send-email.ts`

---

## ⚡ HIGH PRIORITY (Performance & Core Features)

### 4. **Properties Grid Still Uses Placeholder Data**
**Priority:** HIGH  
**Issue:** `PropertiesGrid.tsx` hardcodes 6 placeholder listings instead of fetching from database.  
**Impact:** Users see fake properties; no real data displayed.  
**Steps:**
1. Create `src/db/queries/listings.ts`:
   ```typescript
   import { sql } from "@/lib/db";
   
   export async function getPublishedListings(zone?: string, type?: string) {
     let query = `
       SELECT id, title, type, zone, area, beds, baths, size, price, ref, image_url
       FROM public_listings
       WHERE published = true
     `;
     const params: unknown[] = [];
     
     if (zone) {
       params.push(zone);
       query += ` AND zone = $${params.length}`;
     }
     if (type) {
       params.push(type);
       query += ` AND type = $${params.length}`;
     }
     
     query += ` ORDER BY created_at DESC`;
     return sql(query, params);
   }
   ```

2. Update `PropertiesGrid.tsx` to use Server Action or direct query.

3. Handle empty state gracefully (placeholder until DB is populated).

### 5. **Missing Database Queries Module**
**Issue:** `/src/db/queries/` directory exists but is empty.  
**Need:** Create query functions for:
- Listings (filter by zone, type, price range)
- Blog posts (from Sanity + metadata)
- Team (from Sanity)
- Career listings (from Sanity)

### 6. **No Image Upload Handler**
**Issue:** Website accepts property images but has no UI for this (staff only?).  
**Need:** Create Server Action for image upload:
   ```typescript
   // src/actions/upload-property-image.ts
   "use server";
   
   import { uploadToSpaces } from "@/lib/spaces";
   
   export async function uploadPropertyImage(
     formData: FormData,
     propertyId: string
   ) {
     const file = formData.get("image") as File;
     if (!file) throw new Error("No file");
     if (!file.type.startsWith("image/")) throw new Error("Not an image");
     
     const buffer = await file.arrayBuffer();
     const key = `properties/${propertyId}/${Date.now()}.webp`;
     const url = await uploadToSpaces(
       Buffer.from(buffer),
       key,
       "image/webp"
     );
     return { url };
   }
   ```

### 7. **Add Real-time Property Search/Filtering**
**Impact:** Better UX for property discovery.  
**Approach:**
- Add zones/types/price range filters to `PropertiesGrid`
- Use Next.js search params for URL state (`?zone=AB&type=Apartment&priceMax=100000`)
- Implement pagination (10 per page)
- Use `useTransition` for optimistic UI updates

---

## 📊 MEDIUM PRIORITY (SEO, Analytics & Content)

### 8. **Missing Open Graph Images**
**Issue:** No dynamic OG images for social sharing.  
**Fix:** Add `og-image.png` to `/public/` and implement route handlers for dynamic OG:
```typescript
// src/app/api/og/route.tsx
import { ImageResponse } from "next/og";

export async function GET(req: Request) {
  return new ImageResponse(
    <div tw="flex items-center justify-center w-full h-full bg-blue-900">
      <h1 tw="text-6xl text-white">Chabrin Agencies</h1>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

### 9. **Add Structured Data (Schema.org JSON-LD)**
**Impact:** Better Google Rich Results for properties, organization info.  
**Add to layouts:**
```typescript
// src/components/layout/StructuredData.tsx
export function OrganizationSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "Chabrin Agencies Limited",
          url: "https://chabrinagencies.com",
          telephone: "+254720854389",
          email: "info@chabrinagencies.com",
          areaServed: ["Nairobi", "Kiambu", "Murang'a", "Kajiado"],
        }),
      }}
    />
  );
}
```

### 10. **Add Google Search Console & Sitemap**
**Files to create:**
- `src/app/sitemap.ts` — Dynamic sitemap with all pages + properties
- `src/app/robots.ts` — Robot rules
- Add meta verification tags

### 11. **Blog Comments/Engagement**
**Issue:** Blog exists in Sanity but no reader engagement features.  
**Options:**
- Add Disqus comments (managed solution)
- Or build native comments (requires moderation)

---

## 🛠️ CODE QUALITY & MAINTAINABILITY

### 12. **Add Unit Tests**
**Current state:** `@playwright/test` and `vitest` are installed but no tests written.  
**Need:** Add:
- Component tests (Vitest + React Testing Library)
- API route tests
- Example: `src/app/api/contact/route.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

describe("POST /api/contact", () => {
  it("should reject invalid email", async () => {
    const req = new NextRequest("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify({ email: "invalid" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(422);
  });
});
```

### 13. **Add Comprehensive Error Logging**
**Issue:** Console logging present but no error tracking service (e.g., Sentry).  
**Recommendation:** Add Sentry integration:
```bash
npm install @sentry/nextjs
```
Create `src/instrumentation.ts` (Next.js server logger).

### 14. **Type Safety for Listings**
**Need:** Create shared types in `src/types/index.ts`:
```typescript
export interface Listing {
  id: string;
  title: string;
  type: "Apartment" | "House" | "Office" | "Commercial";
  zone: "AB" | "C" | "D" | "E" | "F" | "G";
  area: string;
  beds: number;
  baths: number;
  size: string;
  price: string;
  ref: string;
  imageUrl?: string;
  published: boolean;
  createdAt: Date;
}
```

### 15. **Missing Data Validation Middleware**
**For API routes:** Create middleware to validate all POST requests:
```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  // Rate limiting, auth checks, CORS headers
}

export const config = {
  matcher: ["/api/:path*"],
};
```

---

## 🎨 UX/DESIGN IMPROVEMENTS

### 16. **Add Loading Skeletons**
**Issue:** Properties grid has no loading state while fetching from DB.  
**Solution:** Create skeleton components:
```typescript
// src/components/sections/properties/PropertyCardSkeleton.tsx
export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-1/2" />
      </div>
    </div>
  );
}
```

### 17. **Add Empty States for All Sections**
- Properties grid with no results
- Blog with no posts
- Careers with no openings

### 18. **Improve Mobile Navigation**
**Issue:** Mobile menu works but could have smoother animations and better a11y.  
**Improvement:** Add Framer Motion or CSS animations for menu transitions.

### 19. **Add Breadcrumb Navigation**
On detail pages (blog post, single property) to aid navigation and SEO.

---

## 🔧 INFRASTRUCTURE & DEVOPS

### 20. **Add Health Check Endpoint**
```typescript
// src/app/api/health/route.ts
export async function GET() {
  const dbHealth = await checkDb();
  return Response.json({
    status: dbHealth ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
  });
}
```
Use with PM2 monitoring.

### 21. **Add Database Connection Pooling Monitoring**
Currently set to max 10 connections. Monitor in production:
- Add metrics export to `/metrics` endpoint (for Prometheus)
- Track connection pool exhaustion

### 22. **GitHub Actions Improvements**
**Current:** Likely missing or minimal CI/CD.  
**Add:**
- Lint & type-check on pull requests
- E2E tests (Playwright)
- Build check
- Deploy to staging on PR
- Auto-deploy to production on merge to main

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 22
      - run: npm ci && npm run lint && npm run build
      - run: |
          ssh deploy@165.227.138.108 \
            "cd /var/www/chabrin && git pull && npm ci && npm run build && pm2 reload chabrin-web"
```

---

## 📱 MISSING PAGES & FEATURES

### 23. **Properties Detail Page Missing**
**Issue:** Properties have a `ref` but no `/properties/[ref]` page.  
**Create:** `src/app/[locale]/properties/[ref]/page.tsx`
- Display full property details
- Gallery (multiple images)
- Map (Mapbox integration started, needs impl)
- Enquiry form pre-filled with ref
- Related properties

### 24. **Blog Not Fully Connected**
**Status:** Blog page route exists but no Sanity queries implemented.  
**Need:**
- `src/sanity/queries/blog.ts` — GROQ queries
- Fetch posts in blog page
- Single post detail page `/blog/[slug]`
- Author info, reading time, tags

### 25. **Careers Page Not Implemented**
**Similar to blog** — needs Sanity content + detail pages.

### 26. **Team/Leadership Page**
**From CLAUDE.md:** Website should feature team members (from Sanity).

---

## 📧 CONTENT & COPY

### 27. **Add FAQ Section**
**Impact:** Reduce support emails, improve SEO.  
**Content:** Common property management questions.  
**Place:** After services section on homepage.

### 28. **Add Testimonials Section**
**Impact:** Social proof, conversion optimization.  
**From:** Existing clients (manually or via Sanity).

### 29. **Add Case Studies/Success Stories**
**Example:** "Managed 200+ properties for XYZ investor across 5 zones"

---

## 🔐 SECURITY ENHANCEMENTS

### 30. **Rate Limiting on Contact Form API**
**Issue:** No rate limiting — vulnerable to spam abuse.  
**Solution:** Use `Ratelimit` library:
```bash
npm install @upstash/ratelimit
```
```typescript
// In /api/contact/route.ts
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
});

const { success } = await ratelimit.limit(req.ip ?? "anonymous");
if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
```

### 31. **CORS Configuration**
**Add CORS headers** for API routes (currently only in next.config CSP):
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://chabrinagencies.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
```

### 32. **Audit NPM Dependencies**
**Run:** `npm audit` — check for known vulnerabilities.  
**Set up:** Dependabot notifications in GitHub.

---

## 📈 ANALYTICS & MONITORING

### 33. **Add Vercel Analytics / PostHog**
Understand user behavior:
- Which properties get most clicks
- Where users drop off
- Geographic distribution

### 34. **Add Password-Protected Admin Panel** (Optional for future)
For staff to manage listings, view enquiries, etc.

---

## 🚀 QUICK WINS (Implement First)

| Task | Time | Impact | Files |
|------|------|--------|-------|
| Fix Turnstile token in form | 30 min | Security | ContactForm.tsx |
| Add email delivery (nodemailer) | 1 hour | Lead capture | send-email.ts (new) |
| Connect properties to DB | 1-2 hours | Core feature | listings.ts query, PropertiesGrid.tsx |
| Add database query functions | 1 hour | Foundation | src/db/queries/*.ts |
| Add structured data (JSON-LD) | 30 min | SEO | StructuredData.tsx (new) |
| Create properties detail page | 1-2 hours | UX | [locale]/properties/[ref]/page.tsx (new) |
| Add sitemap.ts + robots.ts | 30 min | SEO | sitemap.ts, robots.ts (new) |
| Implement property filtering | 1-2 hours | UX | PropertiesGrid.tsx |

**Estimated sprint:** 2 weeks for top 8 items = fully functional property listing platform.

---

## 📋 CHECKLIST FOR LAUNCH

Before going live, verify:
- [ ] Turnstile bot protection active
- [ ] Email delivery working
- [ ] All environment variables configured
- [ ] Real properties in database
- [ ] Privacy Policy page live
- [ ] Consent checkboxes functional
- [ ] EXIF stripping verified on uploads
- [ ] SSL certificate valid
- [ ] PM2 running with cluster (2 instances)
- [ ] Nginx reverse proxy configured
- [ ] Database backups scheduled
- [ ] CHIPS sync running on schedule
- [ ] Monitoring/alerting set up
- [ ] Sentry or error tracking active

