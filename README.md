<p align="center">
  <img src="frontend/public/images/logo.png" alt="ShopStackLogo" width="120" />
</p>

<h1 align="center">
  <a href="https://github.com/your-username/NovaShop">ShopStack</a>
</h1>

<p align="center">
  <b>A modern full-stack e-commerce platform</b> crafted for the Iranian market with a stunning storefront, powerful admin dashboard, and Blupal payment integration.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## ✨ Features

### 🛒 Customer Storefront
- **Home Page** — Hero section, latest products, categories, features, testimonials, and CTA with animated elements
- **Product Listing** — Browse products by category with pagination and search
- **Product Detail** — Full product information with images, pricing, and reviews
- **Shopping Cart** — Persistent cart with localStorage, quantity management, discount calculations, and free shipping threshold
- **Checkout & Payment** — Online order form with Blupal payment gateway integration
- **User Authentication** — Login / Register with email or phone, JWT-based sessions
- **User Profile** — Manage personal information
- **Responsive Design** — Fully responsive with mobile hamburger menu, glassmorphism UI, and RTL support
- **Smooth Animations** — Framer Motion, AOS scroll animations, and transition effects throughout

### 📊 Admin Dashboard
- **Dashboard Overview** — Real-time statistics grid, live ticker, revenue charts, order status donut chart, recent orders, and top products
- **Product Management** — Create, read, update, and delete products with categories, brands, tags, and inventory tracking
- **Order Management** — Track and manage orders with status workflow (Pending → Processing → Shipped → Delivered / Cancelled / Returned)
- **Customer Management** — View and manage customer accounts
- **Settings** — System configuration
- **Admin Auth** — Dedicated admin authentication with role-based access control
- **Data Visualization** — Recharts-powered graphs and analytics

### 🔧 Technical Features
- **Rate Limiting** — In-memory API rate limiting with configurable thresholds per route
- **Token-based Auth** — JWT authentication with cookie-based session management
- **Blupal Payment** — Full Blupal invoice creation, payment link generation, webhook handling, and transaction tracking
- **SEO Optimized** — Full metadata support including Open Graph and Twitter Cards
- **Error Handling** — Graceful error boundaries, loading states, and user-friendly toast notifications
- **Type Safety** — TypeScript throughout both applications

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) |
| **Authentication** | [JWT](https://jwt.io/) + [Bcryptjs](https://www.npmjs.com/package/bcryptjs) |
| **Payment** | [Blupal](https://blupal.ir/) (Iranian Payment Gateway) |
| **Form Handling** | [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) + [AOS](https://michalsnik.github.io/aos/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) + Custom SVGs |
| **Notifications** | [react-hot-toast](https://react-hot-toast.com/) |
| **Image Processing** | [Sharp](https://sharp.pixelplumbing.com/) |
| **Utilities** | [Lodash](https://lodash.com/) + [Persian Tools](https://www.npmjs.com/package/persian-tools) |

---

## 🏗️ Architecture

```
apps/
├── frontend/                  # Customer-facing store (port 3000)
│   ├── app/
│   │   ├── page.jsx           # Home page
│   │   ├── products/          # Product listing & detail pages
│   │   ├── cart/              # Shopping cart & checkout
│   │   ├── payment/           # Payment page
│   │   ├── auth/              # Login & Register
│   │   ├── profile/           # User profile
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── api/               # API routes (products, auth, cart, orders, payments, contact)
│   │   ├── layout.js          # Root layout (providers, metadata, SEO)
│   │   └── globals.css        # Global styles
│   ├── components/            # Shared & feature components
│   ├── context/               # Cart & Auth Context providers
│   ├── models/                # Mongoose models (User, Product, Order, Payment)
│   ├── lib/                   # Utility functions (auth, validation, db connection)
│   ├── data/                  # Static data (categories, testimonials)
│   ├── metadata/              # SEO metadata configs
│   └── proxy.js               # Rate limiting & auth middleware
│
├── admin/                     # Admin dashboard (port 3001)
│   ├── app/
│   │   ├── dashboard/         # Admin dashboard
│   │   │   ├── page.jsx       # Overview (stats, charts, recent orders, top products)
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── orders/        # Order management
│   │   │   ├── customers/     # Customer management
│   │   │   ├── settings/      # System settings
│   │   │   └── layout.jsx     # Dashboard layout with sidebar
│   │   ├── auth/login/        # Admin login
│   │   ├── api/               # Admin API routes (dashboard, products, orders, users, categories, settings, messages)
│   │   └── layout.jsx         # Auth layout
│   ├── components/            # Admin components
│   └── lib/                   # Admin utilities
```

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud)
- Blupal merchant account (for payments)
- JWT secret key

### Environment Variables

#### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
JWT_SECRET=your-super-secret-key
```

#### Admin
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001
JWT_SECRET=your-super-secret-key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ShopStack.git
cd ShopStack/apps

# Install frontend dependencies
cd frontend
npm install

# Install admin dependencies
cd ../admin
npm install
```

### Running the Project

```bash
# Terminal 1 — Frontend (Customer Store)
cd frontend
npm run dev
# → http://localhost:3000

# Terminal 2 — Admin (Dashboard)
cd admin
npm run dev
# → http://localhost:3001
```

### Building for Production

```bash
cd frontend
npm run build
npm start

cd ../admin
npm run build
npm start
```

---

## 📂 Project Structure Overview

| App | Purpose | Port |
|-----|---------|------|
| `frontend/` | Customer storefront with shopping, cart, and checkout | `3000` |
| `admin/` | Admin dashboard with management tools | `3001` |

---

## 🔑 Key Concepts

### Authentication Flow
1. User registers/logs in via `/api/auth/login` or `/api/auth/register`
2. Server returns JWT token stored in cookies
3. Frontend reads user info from `/api/auth/me`
4. `AuthProvider` context manages global auth state
5. `proxy.js` middleware validates tokens on protected routes
6. Admin users are redirected to `/dashboard`; regular users to `/products`

### Cart Flow
1. Cart stored in `localStorage` via `CartContext`
2. Products added with quantity, discount, and price tracking
3. Checkout validates form with Yup schema via React Hook Form
4. Order submitted to `/api/payments/create` → Blupal payment link returned
5. User redirected to Blupal for payment
6. Cart cleared on successful order creation

### Admin Access Control
- Admin reads from a separate admin database (read-only mode supported)
- Visual warning banner when in read-only mode
- Role-based routing: regular users → storefront, admins → dashboard

---

## 🌐 Deployment

### Vercel
```bash
# From project root
cd apps/frontend
vercel deploy
```

### Docker
```yaml
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by the <b>NovaShop</b> Team
</p>
