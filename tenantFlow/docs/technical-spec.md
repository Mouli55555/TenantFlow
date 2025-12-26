# Technical Specification

## 1. Folder Structure (Backend)

```
backend/
├── src/
│   ├── config/            # Env vars, DB config
│   ├── middleware/        # Auth, error handlers
│   ├── models/            # Sequelize or ORM models
│   ├── routes/            # Route definitions by module
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── utils/             # Helper functions (e.g., hashing)
│   └── index.js           # App entrypoint
├── migrations/            # Flyway SQL migration scripts
├── .env                   # Local environment variables
├── Dockerfile             # Container config
└── docker-compose.yml     # Compose config for backend+DB
```

Frontend (if in mono-repo):

```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/          # API clients
│   ├── contexts/          # Auth/user context
│   └── main.jsx
├── .env
├── vite.config.js
└── Dockerfile
```

---

## 2. Environment Variables

### Backend

```
PORT=4000
NODE_ENV=development
DATABASE_URL=postgres://user:pass@postgres:5432/app
JWT_SECRET=supersecretjwt
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:3000
```

### Frontend

```
VITE_API_URL=http://localhost:4000
```

---

## 3. Development Setup Guide

### Prerequisites

* Node.js (v18+)
* Docker + Docker Compose
* PostgreSQL CLI (optional for local)

### Steps

```bash
# Clone repo
$ git clone <repo-url>
$ cd backend

# Copy env vars
$ cp .env.example .env

# Start local dev environment
$ docker-compose up --build
```

### Running Backend Locally

```bash
# Install deps
$ npm install

# Run dev server
$ npm run dev

# Run linter/tests (if configured)
$ npm run lint
$ npm test
```

### Flyway Migrations (Optional from Host)

```bash
# Inside migration container or using CLI:
$ flyway -url=jdbc:postgresql://localhost:5432/app -user=user -password=pass migrate
```

---

## 4. Testing (Optional)

* Unit testing via Jest or Mocha
* Use `supertest` for route tests
* Seed test DB via Flyway before tests

```bash
$ npm run test
```

---

## 5. CI/CD Suggestions

* Use GitHub Actions or GitLab CI
* Run Flyway on deploy
* Lint and test before build
* Docker image versioning via tags
