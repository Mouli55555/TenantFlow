# Architecture Overview

## 1. System Architecture Description

The system follows a classic 3-tier architecture using containerized services:

* **Frontend (React SPA):**

  * Communicates via REST with backend.
  * Authenticated via JWT stored in HttpOnly cookie or memory.

* **Backend (Node.js + Express):**

  * Stateless API server.
  * Validates JWT, enforces role/tenant policies.
  * Applies `tenant_id` scoping to data queries.

* **Database (PostgreSQL):**

  * Shared DB with shared schema and `tenant_id` column on scoped tables.
  * Enforces foreign keys, indexing, and optional Row-Level Security.

* **DevOps:**

  * Dockerized backend, frontend, and PostgreSQL instance.
  * Docker Compose orchestrates local and CI deployments.

## 2. System Diagram

```
[Browser]
   |
[React Frontend SPA] --- JWT ---> [Node.js + Express API]
                                      |
                             [PostgreSQL Database]
```

> Diagram should be saved as: `docs/images/system-architecture.png`

---

## 3. Entity Relationship Diagram (ERD)

Key tables (shared schema):

* `tenants(id, name, status)`
* `users(id, tenant_id, email, password_hash, role)`
* `projects(id, tenant_id, name, description)`
* `tasks(id, tenant_id, project_id, assignee_id, title, status)`
* `audit_logs(id, tenant_id, action, entity_type, user_id, timestamp)`

> ERD should be saved as: `docs/images/database-erd.png`

---

## 4. API Endpoint List

### Auth

| Method | Endpoint           | Auth Required | Role Scope |
| ------ | ------------------ | ------------- | ---------- |
| POST   | /api/auth/register | No            | N/A        |
| POST   | /api/auth/login    | No            | N/A        |
| POST   | /api/auth/logout   | Yes           | All        |

### Tenant

| Method | Endpoint         | Auth Required | Role Scope  |
| ------ | ---------------- | ------------- | ----------- |
| POST   | /api/tenants     | Yes           | Super Admin |
| PUT    | /api/tenants/:id | Yes           | Super Admin |
| GET    | /api/tenants     | Yes           | Super Admin |

### User

| Method | Endpoint            | Auth Required | Role Scope   |
| ------ | ------------------- | ------------- | ------------ |
| GET    | /api/users          | Yes           | Tenant Admin |
| POST   | /api/users/invite   | Yes           | Tenant Admin |
| PUT    | /api/users/:id/role | Yes           | Tenant Admin |
| DELETE | /api/users/:id      | Yes           | Tenant Admin |

### Projects

| Method | Endpoint          | Auth Required | Role Scope |
| ------ | ----------------- | ------------- | ---------- |
| POST   | /api/projects     | Yes           | All        |
| GET    | /api/projects     | Yes           | All        |
| PUT    | /api/projects/:id | Yes           | All        |
| DELETE | /api/projects/:id | Yes           | All        |

### Tasks

| Method | Endpoint               | Auth Required | Role Scope |
| ------ | ---------------------- | ------------- | ---------- |
| POST   | /api/tasks             | Yes           | All        |
| GET    | /api/tasks?project=:id | Yes           | All        |
| PUT    | /api/tasks/:id         | Yes           | All        |
| DELETE | /api/tasks/:id         | Yes           | All        |

### Audit Logs

| Method | Endpoint        | Auth Required | Role Scope  |
| ------ | --------------- | ------------- | ----------- |
| GET    | /api/audit-logs | Yes           | Super Admin |
