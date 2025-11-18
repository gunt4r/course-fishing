📚 Course Fishing — Full-Stack E-Commerce Platform for Digital Courses
A modern, high-performance full-stack e-commerce platform built for selling digital courses.
Powered by Next.js App Router, PostgreSQL, TypeORM, Tailwind CSS, next-intl, PayPal, and a fully customized admin dashboard with a built-in HTML editor.

Designed for real-world production use — secure, fast, scalable.

✨ Features
🔐 Authentication & User Accounts
Email registration & login

Secure password hashing (bcrypt)

JWT-based auth

Fully typed API integration

💳 Payments (PayPal)
Full PayPal client integration

Secure payment processing using @paypal/react-paypal-js

Real-time purchase confirmation

Automatic email notifications (via Nodemailer)

🎓 Course Marketplace
Purchase & immediate access

Protected content per user

Multi-language support for product texts

🌍 Internationalization
Built using next-intl

Language switcher

🛠️ Admin Panel
Secure Admin dashboard

Rich text editing via React Quill

Create blog posts, articles, or long-form content

Upload course previews, manage pricing

🎨 UI / UX
Tailwind CSS v4

HeroUI components

Framer Motion animations

Swiper sliders

Toast notifications (react-hot-toast)

🧩 State & Data
Zustand for client-side state

React Query for API fetching

TypeORM + PostgreSQL on backend

Axios client abstraction

🏗️ Full Stack Architecture
Next.js App Router

PostgreSQL database

Uses reflect-metadata, TypeORM entities

📦 Developer Tooling
ESLint (Antfu config + Next.js rules)

TypeScript strict mode

Tailwind class linting

Semantic Release (automated versioning)

Turbopack for blazing-fast dev server

🚀 Tech Stack
Frontend
Next.js 15 App Router

React 19

Tailwind CSS 4

HeroUI

next-intl

Framer Motion

Swiper

Zustand

React Query

Backend
NextJS

PostgreSQL

TypeORM

Nodemailer

JWT

Payments
PayPal SDK (@paypal/react-paypal-js)

Other

Semantic Release

ESLint + Tailwind linting

Migrations via TypeORM

📁 Project Structure
course-fishing/
│
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # UI components
│   ├── modules/          # Backend modules (NestJS-like structure)
│   ├── locales/          # next-intl translations
│   ├── entities/         # TypeORM entities
│   └── hooks/            # Zustand / utility hooks
│
├── public/               # Static assets
├── scripts/              # Migration scripts
├── .env.example          # Environment variables template
└── README.md

⚙️ Environment Variables
Create a .env file:

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB_NAME
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

🧪 Installation & Running Locally
1. Clone the repo
git clone https://github.com/gunt4r/course-fishing
cd course-fishing

2. Install dependencies
npm install 
3. Start development server
npm run dev

🏗️ Build for Production
npm run build
npm start

☁️ Deployment (Railway)
1. Create a new Railway project
2. Add PostgreSQL as a service
3. Set environment variables in Railway dashboard
4. Deploy
Railway will automatically detect the Next.js app.

📜 License
MIT License.

⭐ Support the Project
If you find this project useful, please give the repository a star ⭐
Your support helps development!