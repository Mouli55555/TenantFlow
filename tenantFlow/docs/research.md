# Research: Multi-Tenancy, Tech Stack Justification & Security Measures

## Summary

This document compares multi-tenancy models, explains and justifies the chosen approach (Shared Database / Shared Schema with strict `tenant_id` isolation), describes the chosen technology stack (Node.js with Express, React, PostgreSQL, JWT, Docker, Flyway) and explains recommended security measures for a production-ready, multi-tenant SaaS Project & Task Management system.

---

## 1. Multi-Tenancy Analysis

### Models compared

We compare three common multi-tenancy models:

1. **Shared Database, Shared Schema (single DB, single set of tables)**

   * **Description:** All tenants share the same tables; every tenant-scoped row includes a `tenant_id` column which identifies owner tenant.
   * **When to choose:** Many tenants, cost-sensitive deployments, and when tenant isolation can be reliably enforced at application layer.
2. **Shared Database, Separate Schemas (single DB, schema per tenant)**

   * **Description:** Each tenant has its own schema within the same database instance (e.g., `tenant_a.*`, `tenant_b.*`).
   * **When to choose:** Moderate number of tenants, need for per-tenant customization of schema while keeping a single DB instance.
3. **Separate Database per Tenant (one DB instance per tenant)**

   * **Description:** Each tenant has a separate database (physically isolated).
   * **When to choose:** Very strong isolation or compliance requirements, or very large tenants requiring individual tuning.

### Pros & Cons (concise)

| Model                       |                                                                                                 Pros | Cons                                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------- |
| Shared DB, Shared Schema    |               Lowest infra cost; easiest to run migrations and operate; simpler backup & monitoring. | Requires strict app-level isolation - risky if filters fail; performance hot-spots if single DB overloaded. |
| Shared DB, Separate Schemas | Better logical isolation; easier to isolate tenant objects; small per-tenant customizations allowed. | More complex migrations (apply per-schema), schema count can grow large and hurt manageability.             |
| Separate DB per Tenant      |    Maximum isolation, easiest for per-tenant compliance and backups; independent tuning/replication. | Highest cost and operational overhead; more complex orchestration and CI/CD across many DBs.                |

### Chosen approach & justification

**Shared Database + Shared Schema** with `tenant_id` on all tenant-scoped tables, and strong enforcement at the service layer plus JWT-based tenant identification.

**Reasons:**

* The course/project and evaluation environment expect a single repository and deterministic, automated migrations and seeds. Shared-schema keeps the deployment and automated evaluation consistent and simple.
* Cost and operational simplicity: one DB instance for evaluation and typical SaaS usage is the most economical and easiest to automate in CI/CD and containerized deployments.
* Strong application-level enforcement plus defense-in-depth (optionally add PostgreSQL Row-Level Security (RLS) later) provides acceptable security for most SaaS customers while keeping complexity manageable.
* The chosen development stack (Node.js with Express + Flyway) integrates well with shared-schema migration workflows.

**Enforcement strategy (summary):**

* JWT tokens include `{ userId, tenantId, role }` claims.
* Authentication middleware validates tokens and injects `tenantId` into request context.
* Repository/service layer always applies `WHERE tenant_id = :tenantId` for tenant-scoped queries.
* Tenant-related creation flows use database transactions (e.g., create tenant + admin user atomically).
* Optional DB-level RLS policies can be added as a hardened secondary control.

---

## 2. Technology Stack Justification

### Backend: **Node.js with Express**

**Why chosen:**

* Lightweight, asynchronous I/O, fast development cycle.
* Large ecosystem with mature libraries for JWT, ORM, and API routing.
* JavaScript full-stack synergy with React frontend.
* Strong community support, good performance for REST APIs.

**Alternatives considered:**

* Spring Boot: powerful and enterprise-ready, but Node.js chosen for JS full-stack and lower boilerplate.
* NestJS: better structure than raw Express, but Express chosen for simplicity.

### Frontend: **React**

**Why chosen:**

* Widely adopted SPA framework with excellent component model.
* Strong ecosystem for form validation, routing, state management.
* Seamless integration with REST APIs and JWT-based auth.
* Efficient rendering with hooks, good for productivity.

**Alternatives considered:**

* Angular: heavier setup, more opinionated.
* Vue: excellent choice, but React preferred for its broader adoption.

### Database: **PostgreSQL**

**Why chosen:**

* Reliable, widely used, ACID-compliant relational DB — fits relational nature of projects/tasks/users.
* Advanced features like indexes, partitioning, JSONB, and Row-Level Security (RLS).
* Excellent tooling & community support.

### Authentication: **JWT (stateless tokens)**

**Why chosen:**

* Stateless tokens simplify horizontal scaling.
* JWT can carry `tenantId` and `role` claims to allow fast auth checks.
* Well-supported in Node.js with libraries like `jsonwebtoken`.

### DevOps & Packaging: **Docker + Docker Compose**

**Why chosen:**

* Reproducible builds.
* Single command to start full stack.
* Matches project requirement for named services and ports.

### DB Migrations: **Flyway**

**Why chosen:**

* File-based SQL migrations with deterministic order.
* Easy integration in CI and Docker builds.

---

## 3. Security Considerations & Measures

### 3.1 Tenant Data Isolation

* All tenant-scoped tables include `tenant_id`.
* Every query filtered using authenticated `tenantId`.
* Optional PostgreSQL RLS for extra layer.
* Audit logs for each sensitive operation.

### 3.2 JWT and Role-Based Access Control (RBAC)

* JWT contains: `userId`, `tenantId`, `role`, `exp`.
* Tenant-admin can manage users and projects within tenant.
* Super-admin has `tenantId = null` and global scope.

### 3.3 Password Handling

* Passwords hashed using bcrypt (salted, recommended cost 10-12).
* Minimum password length and complexity enforced.

### 3.4 Token Storage & Security

* Use HttpOnly secure cookies or in-memory storage.
* Support logout by token invalidation or client-side deletion.
* Optional refresh token for long sessions.

### 3.5 Transport Layer & Environment Security

* Enforce HTTPS in production.
* Secrets via environment variables.
* Use `SameSite`, CORS strict origin policies.
* DB user has minimum necessary privileges.

### 3.6 Input Validation

* Sanitize and validate all user inputs.
* Use parameterized queries (e.g., via ORM or query builder).
* Enforce enum validation in APIs.

### 3.7 Monitoring & Logs

* Health check endpoint for orchestration.
* Structured logs and audit logs.
* Dependency vulnerability scanning and regular updates.

---

## Closing Remarks

The Node.js + Express + PostgreSQL + JWT + Docker stack with shared-schema multi-tenancy offers a flexible, secure, and production-ready foundation for the SaaS platform. Defense-in-depth practices and layered isolation strategies ensure tenant security, while the modular tech stack simplifies both development and deployment.
