# ⚡ Loomix Blocks Registry

<div align="center">

![Loomix Banner](https://loomix.pro/background-silk.webp)

### **Production-Ready Modular Headless E-Commerce Component Registry**
*Crafted for Next.js 16, MedusaJS v2, Strapi CMS v5, and Tailwind CSS.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MedusaJS](https://img.shields.io/badge/MedusaJS-v2-8A2BE2?style=for-the-badge&logo=medusa)](https://medusajs.com/)
[![Strapi](https://img.shields.io/badge/Strapi-v5-4945FF?style=for-the-badge&logo=strapi)](https://strapi.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🌐 Official Website](https://loomix.pro) • [📖 Documentation](https://loomix.pro/docs) • [🚀 Live Demos](#-live-storefront-showcases) • [🧩 21st.dev Profile](https://21st.dev/@a.karamooz3232)

</div>

---

## 💡 Overview

Building a modern, enterprise-grade headless e-commerce storefront typically takes **3 to 6 months** of boilerplate setup, design system architecture, state management, and API wiring between a headless cart engine and a CMS.

**Loomix Blocks Registry** is an open modular library of production-grade e-commerce components designed specifically for developers building headless storefronts. Every block is architected to seamlessly map to **Strapi Dynamic Zones** for content managers, while communicating with **MedusaJS v2** for cart, pricing, inventory, and checkout operations.

---

## 🌟 Live Storefront Showcases

See these modular blocks in action across live industry-tailored storefronts:

| Showcase | Industry | Live Demo | Description |
| :--- | :--- | :--- | :--- |
| **Aura Fashion** | Luxury & Apparel | [fashion.loomix.pro](https://fashion.loomix.pro) | High-end visual storytelling, dynamic size/color swatch selectors, and editorial lookbooks. |
| **Terra Craft** | Artisan Roastery | [coffee.loomix.pro](https://coffee.loomix.pro) | Roast spectrum visual filters, sensory tasting notes, and subscription-ready checkout flows. |
| **Loomix Core** | Developer Platform | [loomix.pro](https://loomix.pro) | Complete documentation, interactive CLI guide, and architecture blueprints. |

---

## 🧩 Component Registry Modules

The registry is organized into focused, plug-and-play domain modules inside `src/modules/`:

```
src/modules/
├── home/          # Homepage dynamic section blocks
├── products/      # Product displays, galleries & swatch selectors
├── cart/          # Slide-over cart drawer & order summary
├── checkout/      # Multi-step checkout, address & payment forms
├── store/         # Product catalog, Meilisearch filters & pagination
├── account/       # User authentication, OTP verification & profile
├── order/         # Order confirmation, tracking & history
├── layout/        # Dynamic headers, mega-menus & footers
└── common/        # Shared buttons, modals, badges & UI primitives
```

### 📦 Key Blocks Highlight

* **Cinematic Product Scroll (`/home/components/ProductScroll`):**  
  Sticky scroll-triggered product progression with smooth Framer Motion camera transitions.
* **Dynamic Zone Feature Blocks (`/home/components/FeaturesBlock`):**  
  Adaptive grid and split-layout feature showcases mapped directly to Strapi CMS schemas.
* **Category Collection Showcase (`/home/components/CategoryCollectionShowcase`):**  
  Interactive category visual cards with responsive hover states and direct collection filtering.
* **Store Catalog & Fast Search (`/store`):**  
  Instant full-text search integration with Meilisearch, price range sliders, and active facet chips.
* **Frictionless Checkout Flow (`/checkout`):**  
  Clean multi-step checkout with address auto-completion, shipping method selectors, and payment gateway integration.

---

## 🛠️ Tech Stack & Architecture

* **Framework:** [Next.js 16](https://nextjs.org/) (React 19, Server Components, App Router)
* **E-Commerce Backend:** [MedusaJS v2](https://medusajs.com/) (Node.js Headless Engine)
* **Headless CMS:** [Strapi v5](https://strapi.io/) (Visual page builder & global settings)
* **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/) + [Anime.js](https://animejs.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Internationalization:** [next-intl](https://next-intl.dev/) (RTL & LTR multi-language support: EN, FA, AR, TR, ES, RU, ZH)

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 16 Storefront                       │
│     (Tailwind CSS + Loomix Blocks + Framer Motion)          │
└──────────────────────────┬──────────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│       Strapi v5         │ │       MedusaJS v2       │
│  - Dynamic Page Blocks  │ │  - Cart & Checkout      │
│  - Visual Page Builder  │ │  - Inventory & Pricing  │
│  - Multi-language Copy  │ │  - Orders & Fulfillment │
└─────────────────────────┘ └─────────────────────────┘
```

---

## 🚀 How to Use These Blocks

You can copy and drop any module directly into your Next.js project:

1. **Clone or browse the repository:**
   ```bash
   git clone https://github.com/landa33/loom-blocks-registry.git
   ```

2. **Copy the desired module into your Next.js App Router project:**
   ```bash
   # Example: copy the product scroll block
   cp -r src/modules/home/components/ProductScroll your-nextjs-app/src/components/
   ```

3. **Install standard UI dependencies (if not already installed):**
   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge
   ```

4. **Import and render in your page:**
   ```tsx
   import { ProductScroll } from '@/modules/home/components/ProductScroll'

   export default function Page() {
     return <ProductScroll products={productsData} />
   }
   ```

---

## 👨‍💻 Author & Connect

**Ali Karamooz**  
*Design Engineer & Full-Stack Developer*

* 🌐 **Website:** [loomix.pro](https://loomix.pro)
* 🐙 **GitHub:** [@landa33](https://github.com/landa33)
* 🧩 **21st.dev:** [@a.karamooz3232](https://21st.dev/@a.karamooz3232)
* ✈️ **Telegram:** [@Loomix_pro](https://t.me/Loomix_pro)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — free to use in both personal and commercial projects.

<div align="center">
  <sub>Built with care for the global developer community. Star ⭐ this repository if you find it helpful!</sub>
</div>
