# 📘 ANY Project (Backend)

A scalable, production-ready backend for a ANY project, built with **TypeScript**, **Express.js**, **PostgreSQL (Sequelize)**, and a robust toolchain for linting, formatting, testing, and CI/CD.

---

## 🚀 Tech Stack & Tools

### Core

- **Node.js** + **Express.js** – Backend server
- **TypeScript** – Type safety & developer experience
- **Sequelize** – ORM for PostgreSQL

### Authentication

- **JWT** – Access and refresh tokens
- **Role-based Access Control (RBAC)** – Admin/user permissions

### Validation

- **Zod** – Schema-based request validation

### Security Middleware

- **Helmet** – Secures HTTP headers
- **XSS-Clean** – Prevents XSS attacks
- **HPP** – Prevents HTTP parameter pollution
- **Rate Limiting** – Blocks too many requests
- **Slow Down** – Adds delay to brute-force attempts
- **Compression** – Gzip compression for responses
- **CORS** – Cross-Origin Resource Sharing config

### Utilities

- **Custom Error Classes** – Standardized API errors (`utils/apiError.ts`)
- **Async Handler Wrapper** – No more try-catch in routes (`utils/catchAsync.ts`)
- **JWT Helpers** – Sign & verify tokens (`utils/jwt.ts`)
- **Password Hashing** – `bcrypt` (`utils/bcrypt.ts`)
- **Logger** – Winston-based logging (`utils/logger.ts`)
- **sendResponse** – Standardized response helper (`utils/sendResponse.ts`)

### Code Quality

- **ESLint** – Code linting (`.eslintrc.js`)
- **Prettier** – Code formatting (`.prettierrc`)
- **Husky** – Git hooks
- **lint-staged** – Run linters on staged files only

### CI/CD

- **GitHub Actions** – Automated linting & testing workflow (`.github/workflows/ci.yml`)

---

## 🧰 Folder Structure

```
src/
├── config/         # DB config and env setup
│   ├── db.ts
│   └── env.ts
├── constants/      # Enums and constants (roles, status codes)
├── controllers/    # Route handlers (business logic)
├── middlewares/    # All Express middlewares
├── models/         # Sequelize schemas and models
├── routes/         # Route definitions
├── services/       # Service layer (business logic)
├── types/          # Custom TypeScript types and module declarations
├── utils/          # Helpers: JWT, async handler, error classes, logger, etc.
├── validators/     # Zod validation schemas
├── app.ts          # Main app setup
└── server.ts       # Entry point (loads env, connects DB, starts server)
```

---

## 📦 Dev Environment Setup

```bash
npm install
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Husky + Lint Staged

Prevents bad code from being committed.

```bash
# .husky/pre-commit
npx lint-staged
```

```js
// lint-staged.config.js
module.exports = {
  '**/*.{ts,js,json}': ['eslint --fix', 'prettier --write']
};
```

---

## ✅ GitHub Actions: CI

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm test || echo "No tests yet"
```

---

## 🔐 Auth Features

- Register/Login with email/password
- Access + Refresh JWT tokens
- Secure HTTP-only cookies (if enabled)
- Role-based routes via middleware

---

## ⚙️ Key Middleware

- `globalErrorHandler` – Centralized error handling (`middlewares/global-error-handler.middleware.ts`)
- `notFoundHandler` – 404 handling (`middlewares/not-found-handler.middleware.ts`)
- `protectRoute` – JWT auth check (`middlewares/protect-route.middleware.ts`)
- `authorizeRoles('ADMIN')` – Role check (`middlewares/authorize-roles.middleware.ts`)
- `validateRequest` – Zod request validation (`middlewares/validate-request.middleware.ts`)
- Security: `applySecurityMiddlewares`, `applyRateLimitingMiddlewares`, `applyCompressionMiddleware`

---

## 🛠️ Utilities

- **Async Handler:** `catchAsync` wraps controllers for error handling.
- **API Error:** `ApiError` for consistent error responses.
- **JWT:** `signAccessToken`, `signRefreshToken`, `verifyAccessToken`, `verifyRefreshToken`.
- **Password Hashing:** `hashPassword`, `comparePassword`.
- **Logger:** Winston logger for structured logs.
- **sendResponse:** Standardizes API responses.

---

## 🗂️ TypeScript Setup

- All code is written in TypeScript.
- Custom types and module declarations are in `src/types/`.
- `tsconfig.json` is configured for strict type checking and includes custom types.

---

## 📏 Validation

- Request validation with **Zod** (`validators/`)
- Enforced on every route entry via `validateRequest` middleware.

---

## 🗄️ Database

- **PostgreSQL** with **Sequelize**
- Connection config in `config/db.ts`
- Models in `models/` with TypeScript interfaces, statics, and instance methods.

---

## 📝 Environment Variables

Configure your `.env` file (see `.env.example`):

```
# Server
PORT=5000

# PostgreSQL
DB_NAME=personal_finance
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1d
```

---

## 🚦 Running the Server

```bash
npm run dev      # Start in development mode (with ts-node-dev)
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled JS from dist/
```

---

## 💬 License

MIT – Free to use in personal and commercial projects.

---
