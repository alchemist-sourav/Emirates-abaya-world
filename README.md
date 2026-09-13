# Emirates Abaya World 🌙

Welcome to the **Emirates Abaya World** repository! This is a premium, luxury e-commerce storefront for high-end abayas, built with a modern, high-performance web stack.

## 🚀 Tech Stack

- **Framework**: [Next.js 16.3 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## ✨ Key Features

- **Storefront & Admin Panel**: Separate views for customers `/(shop)` and administrators `/admin`.
- **Authentication**: Secure user login and management powered by Supabase.
- **Database Integration**: Dynamic product fetching and user data handling.
- **Responsive Design**: fully optimized for desktop, tablet, and mobile viewing.
- **Accessible UI**: Uses Radix UI for highly accessible interactive components.
- **Form Handling**: Client-side validation using Zod and React Hook Form.

## 📦 Prerequisites

Make sure you have the following installed before proceeding:
- **Node.js**: Node 18 or newer (`node -v`)
- **npm**: npm v8.15.0 or newer (`npm -v`)
- A **Supabase** account and project setup

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/emirates-abaya-world.git
cd emirates-abaya-world
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory (or copy the existing one if available) and provide your Supabase credentials:

```env
# Obtain these from: https://supabase.com/dashboard/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Used only by server-side code and API routes. Do NOT prefix with NEXT_PUBLIC_.
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

> **Warning**: Never commit your `.env.local` file or expose your `SUPABASE_SERVICE_ROLE_KEY` to the client.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📂 Project Structure

- `/app`: Next.js App Router containing pages and layouts.
  - `/(shop)`: Public storefront routes (Home, Products, Cart, Checkout).
  - `/admin`: Secure administrative routes.
  - `/api`: Server-side API routes.
- `/components`: Reusable UI components.
- `/lib`: Utility functions and helpers.
- `/supabase`: Supabase clients and types.
- `/store`: Zustand global state slices.
- `/types`: TypeScript interfaces and type definitions.

## 📜 Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Runs the built production app.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run type-check`: Checks TypeScript types.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
