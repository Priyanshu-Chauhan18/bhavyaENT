<p align="center">
  <img src="public/images/logo/logo-final-transparent.png" alt="Bhavyaa Enterprises Logo" width="200" />
</p>

<h1 align="center">BHAVYAA ENTERPRISES</h1>

<p align="center">
  <strong>Premium Bottle Cap Manufacturing — Digital Catalog & Enquiry Platform</strong>
</p>

<p align="center">
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" /></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react" alt="React" /></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase" alt="Supabase" /></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" /></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel" alt="Vercel" /></a>
</p>

---

## 📋 Overview

A full-stack web platform for **Bhavyaa Enterprises**, a premium bottle cap manufacturer based in India. The platform serves as a digital product catalog with integrated enquiry management, admin dashboard, and WhatsApp-based customer communication.

### ✨ Key Features

| Feature | Description |
|---|---|
| 🏭 **Product Catalog** | Browse products organized by catalogs and categories with detailed specifications |
| 💬 **WhatsApp Enquiry** | One-click WhatsApp enquiry with pre-filled product details |
| 🔐 **Auth System** | Supabase-powered authentication with role-based access (Admin / Customer) |
| 📊 **Admin Dashboard** | Full CRUD for products, categories, enquiries, and site settings |
| 🎨 **Premium UI** | Montserrat typography, dark industrial theme, smooth Framer Motion animations |
| 📱 **Fully Responsive** | Mobile-first design that works beautifully on all devices |
| 🔍 **SEO Optimized** | Dynamic metadata, sitemap, robots.txt, and Open Graph tags |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **UI** | [React 19](https://react.dev), [Tailwind CSS 4](https://tailwindcss.com) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Backend / DB** | [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage, RLS) |
| **Forms** | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) validation |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Deployment** | [Vercel](https://vercel.com) |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/           # Public pages (home, catalog, contact, about)
│   ├── (account)/          # Authenticated user pages
│   ├── admin/              # Admin dashboard
│   ├── auth/               # Auth flows (sign-in, sign-up, callback)
│   └── api/                # API routes (enquiries, previews)
├── components/             # Shared UI components
│   ├── layout/             # Navbar, Footer, Trust Strip
│   └── ui/                 # Button, Input, Card, etc.
├── features/               # Feature modules
│   ├── admin/              # Admin CRUD, product forms, settings
│   ├── auth/               # Auth actions and guards
│   ├── catalog/            # Catalog display components & data layer
│   ├── enquiry/            # WhatsApp enquiry engine
│   └── enquiries/          # Enquiry management
├── lib/                    # Shared utilities
│   ├── db/                 # Supabase client & helpers
│   ├── config/             # Site config & constants
│   ├── guards/             # Role-based access guards
│   ├── validation/         # Zod schemas
│   └── providers/          # React context providers
└── proxy.ts                # Next.js 16 Proxy (auth & routing)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A [Supabase](https://supabase.com) project (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/Priyanshu-Chauhan18/bhavyaENT.git
cd bhavyaENT
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+91XXXXXXXXXX
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 🗄️ Database

The project uses **Supabase PostgreSQL** with the following core tables:

| Table | Purpose |
|---|---|
| `profiles` | User profiles with roles (`admin` / `customer`) |
| `catalogs` | Top-level product catalogs |
| `categories` | Product categories under catalogs |
| `products` | Product listings with specs, images, pricing |
| `enquiries` | Customer enquiry records |
| `site_settings` | Dynamic site configuration (contact info, SEO, etc.) |
| `enquiry_templates` | WhatsApp message templates |

Row-Level Security (RLS) policies ensure data isolation and role-based access.

---

## 🔐 Authentication & Authorization

| Role | Access |
|---|---|
| **Guest** | Browse catalog, view products, submit enquiries |
| **Customer** | All guest permissions + account management |
| **Admin** | Full dashboard — manage products, categories, enquiries, site settings |

The `proxy.ts` file handles route protection at the edge, with defense-in-depth guards in layouts and server actions.

---

## 📦 Deployment

The project is optimized for **Vercel** deployment:

1. Push code to GitHub
2. Connect the repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push to `main`

---

## 📄 License

This project is proprietary software for **Bhavyaa Enterprises**. All rights reserved.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Priyanshu-Chauhan18">Priyanshu Chauhan</a>
</p>
