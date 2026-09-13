# ⚡ Loomix Blocks Registry

<div align="center">

![Loomix Banner](https://loomix.pro/background-silk.webp)

### **Production-Ready Modular Headless E-Commerce Component Registry**
*Engineered for Next.js 16 (App Router), MedusaJS v2, Strapi CMS v5, and Tailwind CSS v4.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MedusaJS](https://img.shields.io/badge/MedusaJS-v2-8A2BE2?style=for-the-badge&logo=medusa)](https://medusajs.com/)
[![Strapi](https://img.shields.io/badge/Strapi-v5-4945FF?style=for-the-badge&logo=strapi)](https://strapi.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/Loomix-pro/Loomix-registry/pulls)

**[🌐 Official Website & Starter](https://loomix.pro)** • **[📖 Architecture Documentation](https://loomix.pro/docs)** • **[🚀 Live Demos](#-live-storefront-showcases)** • **[🧩 21st.dev Registry](https://21st.dev/@Loomix)**

</div>

---

## 💡 What is Loomix Blocks Registry?

Building an enterprise-ready headless e-commerce storefront typically requires **3 to 6 months** of boilerplate setup, design system wiring, state management, and connecting a headless cart engine to a visual CMS.

**Loomix Blocks Registry** is an open-source, modular library of production-grade e-commerce UI components designed for developers who build storefronts with **Next.js 16**, **MedusaJS v2**, and **Strapi 5**.

Every block is engineered to:
1. **Map cleanly to Strapi Dynamic Zones** so content managers and marketing teams can visually control page layouts.
2. **Communicate natively with MedusaJS v2 APIs** for cart operations, variant selections, inventory, multi-region pricing, and frictionless checkouts.
3. **Support RTL (Right-to-Left) and Multi-language out of the box** (English, Persian, Arabic, Turkish, Spanish, Russian, Chinese) powered by `next-intl`.

---

## 🌟 Live Storefront Showcases

Experience these modular blocks running in live production environments:

| Showcase | Industry | Live Storefront | Highlights |
| :--- | :--- | :--- | :--- |
| **Aura Fashion** | Luxury & Apparel | [fashion.loomix.pro](https://fashion.loomix.pro) | Dynamic color & size swatches, editorial lookbooks, smooth cart drawer. |
| **Terra Craft** | Artisan Roastery | [coffee.loomix.pro](https://coffee.loomix.pro) | Roast spectrum filters, sensory notes, subscription-ready checkout flows. |
| **Loomix Docs** | Developer Platform | [loomix.pro/docs](https://loomix.pro/docs) | Interactive block playground, architecture guides, and CLI setup. |

---

## ⚡ Why Loomix Blocks?

| Feature | Standard DIY Headless | Loomix Blocks Registry |
| :--- | :--- | :--- |
| **Time to Market** | 3 - 6 Months | **A few days** |
| **MedusaJS Version** | Medusa v1 legacy setup | **Native MedusaJS v2** |
| **CMS Visual Builder** | Hardcoded page layouts | **Pre-mapped Strapi 5 Dynamic Zones** |
| **RTL & Multi-language** | Painful manual CSS overrides | **1st-class RTL/LTR with next-intl (7 Locales)** |
| **Styling & UI primitives** | Cluttered legacy CSS | **Tailwind CSS v4 + Framer Motion** |
| **Architecture** | Client-side fetching | **React 19 Server Components (RSC)** |

---

## 🧩 Component Registry Modules

The registry is organized into focused, modular domains inside [`src/modules/`](src/modules/):

```
src/modules/
├── home/          # Dynamic homepage sections (Hero sliders, feature grids, marquees)
├── products/      # Product galleries, interactive swatch selectors, sticky buy boxes
├── cart/          # Slide-over cart drawer, item counters & order summary
├── checkout/      # Multi-step checkout, address auto-fill & payment flows
├── store/         # Meilisearch catalog, price range filters & active facet chips
├── account/       # Authentication, OTP verification & customer profile dashboard
├── order/         # Order confirmation receipts, tracking & order history
├── layout/        # Responsive headers, mega-menus, locale switchers & footers
└── common/        # Shared buttons, modals, badges & UI primitives
```

### 📦 Highlight Components

* **Sticky Cinematic Product Scroll (`/home/components/ProductScroll`):**  
  Scroll-triggered product feature walkthrough with fluid Framer Motion camera choreography.
* **Dynamic Zone Feature Grid (`/home/components/FeaturesBlock`):**  
  Adaptive grid and split-layout feature showcases mapped directly to Strapi CMS schemas.
* **Category Collection Showcase (`/home/components/CategoryCollectionShowcase`):**  
  Interactive visual cards with responsive hover animations and collection filtering.
* **Instant Store Search & Filtering (`/store`):**  
  Instant full-text catalog search powered by Meilisearch with slider facets and query URL sync.
* **Frictionless Multi-Step Checkout (`/checkout`):**  
  Modern checkout flow with payment provider integrations and inline validation.

---

## 🛠️ Tech Stack & Architecture

* **Framework:** [Next.js 16](https://nextjs.org/) (React 19, Server Components, App Router)
* **Commerce Engine:** [MedusaJS v2](https://medusajs.com/) (Headless Commerce Platform)
* **Headless CMS:** [Strapi v5](https://strapi.io/) (Visual Dynamic Zones & Content API)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/) + [Anime.js](https://animejs.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Internationalization:** [next-intl](https://next-intl.dev/) (Full RTL/LTR support)

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js 16 Storefront                       │
│     (Tailwind CSS v4 + Loomix Blocks + Framer Motion)       │
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

## 🚀 Quick Start: Using Blocks in Your Project

You can copy and drop any block directly into your existing Next.js 15/16 App Router project:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Loomix-pro/Loomix-registry.git
   ```

2. **Copy the desired module into your project:**
   ```bash
   # Example: copy the product scroll block
   cp -r src/modules/home/components/ProductScroll your-app/src/components/
   ```

3. **Install UI dependencies:**
   ```bash
   npm install framer-motion lucide-react clsx tailwind-merge
   ```

4. **Import and render in your page:**
   ```tsx
   import { ProductScroll } from '@/components/ProductScroll'

   export default function Page() {
     return <ProductScroll products={productsData} />
   }
   ```

For detailed installation guides, Strapi schema definitions, and full source code access, visit the **[Official Loomix Documentation](https://loomix.pro/docs)**.

---

## 🤝 Contributing

Contributions are always welcome! Whether it's reporting an issue, improving documentation, or submitting a new e-commerce block:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-block`)
3. Commit your changes (`git commit -m 'feat: add testimonial slider block'`)
4. Push to the branch (`git push origin feature/new-block`)
5. Open a Pull Request

---

## 👨‍💻 Author & Connect
 
**Ali Karamooz** — *Design Engineer & Full-Stack Developer*
 
* 🐙 **GitHub:** [@Loomix-pro](https://github.com/Loomix-pro)
* 🏢 **Organization:** [@LoomixPro](https://github.com/LoomixPro)
* 🌐 **Documentation & Starter:** [loomix.pro](https://loomix.pro)
* 🧩 **21st.dev Component Profile:** [@Loomix](https://21st.dev/@Loomix)
* ✈️ **Telegram Support:** [@Loomix_pro](https://t.me/Loomix_pro)
 
---
 
## 📄 License
 
This project is open-source and available under the [MIT License](LICENSE).
 
<div align="center">
 
### ⭐ Support Open Source
If you find this registry helpful, please **star this repository**! It helps other developers discover the project and keeps the ecosystem growing.
 
[![Star on GitHub](https://img.shields.io/github/stars/Loomix-pro/Loomix-registry?style=social)](https://github.com/Loomix-pro/Loomix-registry/stargazers)
 
</div>

