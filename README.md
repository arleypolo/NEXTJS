# Product Platform

A modern e-commerce platform built with Next.js 16, featuring product management, shopping cart, user authentication, and internationalization support.

## 🚀 Features

- **Product Catalog**: Browse products with categories, ratings, and detailed views
- **Shopping Cart**: Zustand-powered cart with localStorage persistence
- **User Authentication**: NextAuth.js integration with FakeStoreAPI
- **Internationalization**: Multi-language support (English & Spanish) using next-intl
- **Admin Panel**: Product management (CRUD operations)
- **Responsive Design**: Mobile-first approach with SCSS modules
- **Server-Side Rendering**: Optimized performance with Next.js App Router

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.x or higher
- **npm** 9.x or higher (or yarn/pnpm)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/arleypolo/NEXTJS.git
   cd NEXTJS
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3.

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 🔐 Authentication

The application uses [FakeStoreAPI](https://fakestoreapi.com/) for authentication. Use these test credentials:

| Username | Password | Role |
|----------|----------|------|
| `johnd` | `m38rmF$` | Admin |
| `mor_2314` | `83r5^_` | User |
| `kevinryan` | `kev02937@` | User |

> **Note**: FakeStoreAPI is a mock API. User registrations are simulated and not persisted.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel (product management)
│   ├── auth/               # Authentication pages
│   ├── cart/               # Shopping cart
│   ├── products/           # Product pages
│   └── profile/            # User profile
├── components/             # Reusable components
│   ├── forms/              # Form components
│   ├── layout/             # Layout components (NavBar, Footer)
│   ├── products/           # Product-related components
│   └── ui/                 # UI primitives
├── contexts/               # React contexts (Cart, Likes)
├── hooks/                  # Custom React hooks
├── i18n/                   # Internationalization config
├── lib/                    # Utilities (auth, registry)
├── services/               # API services (FakeStoreAPI)
├── stores/                 # Zustand stores
├── styles/                 # Global styles and variables
└── types/                  # TypeScript type definitions
messages/
├── en.json                 # English translations
└── es.json                 # Spanish translations
```

## 🌐 Internationalization

The app supports English and Spanish. Language can be switched using the language selector (🌐) in the navigation bar.

- Default language: Spanish (es)
- Available languages: English (en), Spanish (es)
- Language preference is stored in a cookie (`NEXT_LOCALE`)

## 🛒 Cart Functionality

The shopping cart uses Zustand for state management with the following features:

- **Persistence**: Cart data is saved to localStorage
- **Server Sync**: Cart can be synced with FakeStoreAPI
- **Checkout**: Submit cart to the API endpoint

## 🔧 Technologies Used

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.8 | React framework |
| React | 19.2.1 | UI library |
| TypeScript | 5.x | Type safety |
| Zustand | 5.0.9 | State management |
| next-intl | 4.5.8 | Internationalization |
| NextAuth.js | 5.0.0-beta | Authentication |
| Sass | 1.96.0 | Styling |
| styled-components | 6.1.19 | CSS-in-JS |

## 📝 API Integration

The application integrates with [FakeStoreAPI](https://fakestoreapi.com/) for:

- **Products**: GET, POST, PUT, DELETE operations
- **Users**: Authentication and user management
- **Carts**: Shopping cart management

## 👤 Author

**Dawinzon Arley Polo Ciro**
**Gosling**

