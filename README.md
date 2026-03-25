<div align="center">

# ⬡ Bhavya
### Premium B2B Closures & Packaging Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20&%20Auth-3ECF8E?logo=supabase&style=flat-square)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![React Bits](https://img.shields.io/badge/React_Bits-Animations-FF4154?style=flat-square)](https://reactbits.dev/)

</div>

---

## 📖 Official Architecture Guide

> **🚨 IMPORTANT FOR ALL DEVELOPERS:**
> Before committing any code, modifying the schema, or adding new features, you **MUST** read the official post-launch rulebook.
> 
> 👉 **[Read the POST_LAUNCH_ARCHITECTURE.md](./POST_LAUNCH_ARCHITECTURE.md)** 👈

---

## ✨ Overview

Bhavya is an enterprise-grade B2B e-commerce platform explicitly built to convert bulk manufacturing enquiries. Designed with a **"Precision Warmth"** aesthetic, the platform combines a high-end consumer-grade UI with strict B2B logic (locked pricing tiers, WhatsApp-integrated negotiation, and secure user profiles).

### 🚀 Key Features
- **Public Storefront:** Dynamic hero animations (via React Bits), responsive product grids, and a completely bespoke "Warm Industrial" design system.
- **Conversion-Optimized UX:** Tier 1 pricing and MOQ data are concealed behind a frosted-glass constraint, driving guest sign-ups.
- **WhatsApp Integration:** 1-click enquiry generation that automatically formats bulk queries and product SKUs for the manufacturing sales team.
- **Secure Admin Panel:** Full CRUD capabilities for products, categories, site settings, and automated coupon generation.
- **Stateless Architecture:** Fully Edge-ready and infinitely scalable on Vercel/Netlify.

---

## 🛠️ Getting Started

### Prerequisites
- **Node.js**: v18 or newer
- **Supabase**: Requires a linked Supabase project for PostgreSQL database & Auth.

### 1. Clone & Install
```bash
git clone https://github.com/Priyanshu-Chauhan18/havya-platform.git
cd bottle-cap-website
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🎨 Design System: "Precision Warmth"

The UI intentionally avoids standard SaaS blues and hard lines. Instead, it utilizes:
- **Tonal Layering:** Sections separated by subtle background shifts (`#faf8f5` → `#f5f0eb`), eliminating harsh 1px borders.
- **Ambient Shadows:** 24px-48px blurs at incredibly low opacity (4-6%).
- **Accent Gold:** Strict, minimal usage of `#d4a373` gradients exclusively for conversion points.

---

*This project was fundamentally engineered and scaled utilizing intelligent agentic workflows.*
