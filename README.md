# 💸 Finance SaaS – Full Stack Finance Dashboard with Subscriptions

A modern full-stack SaaS finance dashboard application built with the latest tech stack. This project allows users to manage financial records, visualize data with interactive charts, and subscribe to premium plans using Stripe.

---

## 📸 Demo

🌐 [Live Demo](https://finance-saas-app-edjb.vercel.app)

## Credits 
📺 [Watch on YouTube](https://www.youtube.com/watch?v=N_uNKAus0II)

---

## ⚙️ Tech Stack

- **Frontend:** Next.js, ReactJS, TypeScript, ShadCN UI, Zustand, Tailwind CSS
- **Backend:** Drizzle ORM, Hono
- **Auth:** Clerk Authentication
- **Payments:** Stripe
- **Hosting:** Vercel
- **Database:** NeoDatabase, PostgreSQL

---

## 🔥 Features

- 🔐 User authentication via Clerk
- 🗃️ Record income and expenses
- 📁 Categorize transactions

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/salujaharkirat/finance-saas.git
cd finance-saas
```

### 2. Confirm env
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
CLERK_PUBLISHABLE_KEY=
DATABASE_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install dependencies
`bun install`

### 3. Run development Server
`bun run dev`

### 4. Database

```
bun run db:generate #generate migration 
bun run db:apply #run migration
bun run db:studio #run drizzle studio
bun run db:seed #initialize with seed transactions
```

## 🙌 Acknowledgments 
Huge thanks to [Code With Antonio](https://www.youtube.com/@codewithantonio) for making full-stack development education accessible and inspiring.



