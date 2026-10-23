# WEALTHFARM - Institutional Wealth Creation, Commercial Asset & Enterprise Platform
## Architecture, Deployment & Setup Guide

WEALTHFARM is an enterprise-grade full-stack business platform engineered for Nigerian commercial real estate, strategic land due diligence, logistics & transport fleets, enterprise infrastructure, operational field verification, and executive wealth creation education.

---

### 1. Technology Architecture

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Modular functional components, hooks, clean design tokens |
| **Styling & Design System** | Tailwind CSS v4 + Plus Jakarta Sans | Custom color palette (#176B3A, #16A34A, #17231C, #EEF7F0), tabular numerals |
| **Icons & Motion** | Lucide React + Framer Motion | Accessible icons, restrained compositor-only micro-transitions |
| **Server Runtime** | Node.js + Express 4.21 | RESTful API endpoints on `/api/*`, Vite middlewares in dev |
| **Validation** | Zod | Server-side request & schema validation |
| **Authentication & RBAC** | Cryptographic Session Tokens + PBKDF2 | NIST-standard salted hashing (100k rounds SHA-512), USER vs ADMIN roles |
| **Database & Persistence** | Mongoose Models + Resilient Dual Storage | Production Mongoose schemas in `/server/models/mongooseSchemas.ts`, persisted JSON disk mirror in `.data/wealthfarm_db.json` |
| **Payment Gateway** | Paystack Server Integration | Authoritative server price verification, HMAC-SHA512 webhook signature check |

---

### 2. Demonstration Accounts (Pre-Seeded)

For rapid evaluation, the platform comes pre-seeded with two accounts:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Director (ADMIN)** | `admin@wealthfarm.ng` | `WealthFarm@2026` | Full administrative control, catalog editing, user roles, order statuses, task evidence sign-offs |
| **Investor (USER)** | `investor@wealthfarm.ng` | `WealthFarm@2026` | Asset order initiation, Paystack checkout, task evidence submission, course access |

*Note: On the `/login` page and in the top-right profile dropdown, 1-click evaluation buttons are available to switch roles seamlessly.*

---

### 3. Environment Variables Template

Create a `.env` file in the workspace root:

```bash
# Gemini API Key (injected automatically in AI Studio)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Platform Public Base URL
APP_URL="https://your-domain.ng"

# MongoDB Atlas Persistence Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/wealthfarm?retryWrites=true&w=majority"

# Cryptographic Token Secret (HMAC-SHA256)
AUTH_SECRET="wealthfarm_super_secure_institution_key_2026"

# Paystack Secret & Public Keys
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

---

### 4. Local Setup & Production Deployment

#### Development Server
```bash
# Install dependencies
npm install

# Start full-stack server (Express + Vite on Port 3000)
npm run dev
```

#### Production Build
```bash
# Compile frontend assets
npm run build

# Start production server
npm start
```

---

### 5. Standalone Next.js App Router Migration Note

If deploying to Vercel or a dedicated Next.js hosting environment:
1. Production Mongoose schemas with indexes, compound constraints, and TypeScript document interfaces are ready in `/server/models/mongooseSchemas.ts`.
2. Move `/server/routes.ts` endpoints into Next.js Route Handlers (`app/api/[...]/route.ts`).
3. Client components directly mount inside Next.js page layouts (`app/page.tsx`, `app/products/page.tsx`, etc.).

---

### 6. Feature Completion & Integration Checklist

| Module / Feature | Status | Implementation Details |
|---|---|---|
| **Public Institutional Landing Page** | Completed | Hero with authentic asset photography, value proposition, claim-to-proof strip, ecosystem overview, FAQ, and footer. |
| **Institutional About Page** | Completed | Corporate governance, executive leadership bios, anti-Ponzi disclaimer. |
| **Ecosystem Overview** | Completed | Breakdown of commercial land title verification, logistics fleets, enterprise units, and executive training. |
| **Approved Marketplace & Filters** | Completed | Category tabs, search query filter, availability state, price sorting, detailed specs table. |
| **Authoritative Server Pricing** | Completed | Server calculates order totals directly from database records. Client amounts are ignored. |
| **Authentication & RBAC** | Completed | Salted PBKDF2 password hashing, secure tokens, USER and ADMIN roles. Users cannot escalate roles. |
| **Order Placement & Tracking** | Completed | Orders transition through PENDING_PAYMENT, PAID, PROCESSING, COMPLETED, CANCELLED. |
| **Paystack Payment Flow** | Completed | Server-side initialize (`/api/payments/initialize`), server-side verify (`/api/payments/verify`), HMAC-SHA512 webhook handler, and interactive sandbox testing simulator. Live API triggered when `PAYSTACK_SECRET_KEY` is present. |
| **Operational Field Tasks** | Completed | Task registry (cadastral mapping, fleet roadworthiness, feasibility studies). User evidence submission with files/URLs. |
| **Administrative Submission Reviews**| Completed | Admins review evidence, leave feedback, and mark APPROVED, UNDER_REVIEW, or RESUBMISSION_REQUIRED. |
| **Executive Wealth Academy** | Completed | Course catalog, syllabi, interactive video player, protected modules, progress tracking. |
| **Support Resolution Desk** | Completed | Member ticket lodging, multi-party message thread, staff assignment, status lifecycle. |
| **Administrative Control Centre** | Completed | Metrics overview, user role management, product creation, order processing, audit logs. |
| **Legal & Compliance Policies** | Completed | NDPR-compliant Privacy Policy, Terms of Service, Refund Policy, and Task Policy. |
