# Contributing to Loomix Blocks Registry

Thank you for your interest in contributing to the **Loomix Blocks Registry**! We welcome community contributions to help make this the most complete modular headless e-commerce component collection.

---

## How to Contribute

### 1. Proposing a New Block
If you've built a reusable block for Next.js 16, MedusaJS v2, or Strapi 5:
- Ensure the component is written in TypeScript.
- Utilize Tailwind CSS for styling and Framer Motion for animations if applicable.
- Make sure it gracefully handles responsive screens (Mobile to Desktop) and RTL (Right-to-Left) layouts.
- Place the block under the appropriate module directory in `src/modules/<domain>/`.

### 2. Submitting a Pull Request (PR)
1. Fork the repository to your own GitHub account.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/Loomix-registry.git
   ```
3. Create a descriptive branch:
   ```bash
   git checkout -b feat/add-wishlist-drawer
   ```
4. Commit your changes with clear messages following Conventional Commits:
   ```bash
   git commit -m "feat(cart): add interactive slide-over wishlist drawer"
   ```
5. Push to your branch and submit a PR to `main`.

### 3. Reporting Issues & Questions
- If you find a bug or layout glitch, please open an Issue with clear reproduction steps.
- For technical support and architecture discussions, check out our [Documentation](https://loomix.pro/docs) or connect on [Telegram](https://t.me/Loomix_pro).

---

## License
By contributing to this repository, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
