# Product Requirements Document (PRD)

## 1. User Personas

### 1.1 Super Admin

* **Role:** Oversees the platform globally
* **Responsibilities:**

  * Manage tenants and their subscription plans
  * Monitor system health and audit logs
  * Manage global settings and policies
* **Goals:**

  * Maintain uptime and tenant satisfaction
  * Ensure platform security
* **Pain Points:**

  * Tracking misbehaving tenants
  * Balancing platform load across tenants

### 1.2 Tenant Admin

* **Role:** Admin of a specific tenant organization
* **Responsibilities:**

  * Manage tenant’s users
  * Create and assign projects and tasks
  * Handle internal roles and permissions
* **Goals:**

  * Streamline team productivity
  * Maintain task visibility
* **Pain Points:**

  * Managing access control
  * Handling large task/project volumes

### 1.3 End User

* **Role:** General team member within a tenant
* **Responsibilities:**

  * View and update assigned tasks
  * Collaborate on projects
* **Goals:**

  * Complete tasks on time
  * Maintain clarity of work
* **Pain Points:**

  * Missing deadlines due to unclear assignment
  * Overlapping responsibilities

---

## 2. Functional Requirements

### 2.1 Authentication (Auth)

* **FR-001:** The system shall allow users to register and login using email and password.
* **FR-002:** The system shall issue JWT tokens upon successful login.
* **FR-003:** The system shall validate JWT tokens on protected routes.
* **FR-004:** The system shall allow password reset via tokenized email link.

### 2.2 Tenant Management

* **FR-005:** The system shall allow Super Admin to create new tenants.
* **FR-006:** The system shall allow Super Admin to suspend or delete tenants.
* **FR-007:** The system shall allow Tenant Admins to update tenant profile information.

### 2.3 User Management

* **FR-008:** The system shall allow Tenant Admins to invite users via email.
* **FR-009:** The system shall allow users to accept invites and set passwords.
* **FR-010:** The system shall allow Tenant Admins to assign roles to users.

### 2.4 Project Management

* **FR-011:** The system shall allow users to create projects scoped to their tenant.
* **FR-012:** The system shall allow users to assign team members to a project.
* **FR-013:** The system shall allow users to archive, edit, or delete projects.

### 2.5 Task Management

* **FR-014:** The system shall allow users to create tasks under projects.
* **FR-015:** The system shall allow users to assign tasks to team members.
* **FR-016:** The system shall allow users to set task status (e.g., TODO, In Progress, Done).
* **FR-017:** The system shall allow users to comment on and update tasks.

---

## 3. Non-Functional Requirements

* **NFR-001:** The system shall support concurrent usage by 1000+ users with minimal latency.
* **NFR-002:** The system shall isolate tenant data using enforced `tenant_id` on all scoped queries.
* **NFR-003:** The system shall be deployable via Docker Compose for consistent environments.
* **NFR-004:** The system shall secure all API traffic via HTTPS in production.
* **NFR-005:** The system shall log all key events (login, role changes, deletes) for audit purposes.
