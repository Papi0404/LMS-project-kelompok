# AGENTS.md — LMS Development Guidelines

## 1. PROJECT OBJECTIVE

Build a secure, maintainable, scalable, and production-ready Learning Management System (LMS).

The LMS supports the following roles:

* **Admin:** Manage users, roles, courses, classes, exams, system settings, and reports.
* **Teacher:** Manage assigned courses, learning materials, assignments, exams, submissions, and grades.
* **Student:** Access enrolled courses, study materials, submit assignments, take exams, and view personal grades.

Core priorities, in order:

1. Security and data integrity.
2. Correctness and reliability.
3. Maintainable architecture.
4. Clear separation of responsibilities.
5. User experience and accessibility.
6. Performance and scalability.

Do not optimize for visual appearance at the expense of security or correctness.

## 2. MANDATORY ENGINEERING PRINCIPLES

All AI agents must follow these rules.

### 2.1 Understand Before Implementing

* Inspect the existing project structure, dependencies, configuration, and coding conventions before making changes.
* Read this file and any applicable nested `AGENTS.md` files.
* Identify related components, services, database tables, authorization rules, and tests before modifying functionality.
* Do not replace existing architecture or rewrite working modules without a clear technical reason.
* If requirements are ambiguous and the decision affects security, data integrity, or architecture, ask for clarification rather than making unsafe assumptions.

### 2.2 Implement Complete, Real Functionality

* Never create placeholder functionality that appears operational but does not perform the actual operation.
* Do not use hardcoded users, fake API responses, mock authentication, or fabricated database records in production paths.
* Do not silently swallow errors or report success when an operation has failed.
* Do not leave critical functionality implemented only in the frontend.
* Every implemented feature must have appropriate validation, authorization, error handling, and tests.
* If a feature cannot be completed safely, explain the limitation and clearly mark it as incomplete.
* Never claim that a feature or test works unless it has been verified.

### 2.3 Make Small, Focused Changes

* Keep changes scoped to the requested feature.
* Avoid unrelated refactoring, unnecessary dependencies, and duplicated implementations.
* Preserve existing behavior unless a change is intentional and documented.
* Update related tests, types, documentation, and database migrations whenever necessary.

## 3. REQUIRED TECHNOLOGY STACK

Use the following stack for a new project unless the existing project or an explicit requirement dictates otherwise.

### Frontend

* Next.js App Router
* React
* TypeScript with strict mode
* Tailwind CSS
* shadcn/ui where appropriate
* Zod for client-side form validation and shared schemas where appropriate

### Backend

* Next.js Route Handlers and server-side modules for backend HTTP endpoints and application services.
* Supabase Auth for authentication.
* PostgreSQL through Supabase for persistent data.
* Supabase Storage for private learning materials, submissions, and other files.
* Database Row Level Security (RLS) for data access enforcement.

### Testing

* Vitest or the project's existing unit-testing framework.
* Playwright for critical end-to-end user flows.
* Use the existing test infrastructure when one is already established.

Do not add alternative frameworks or libraries without a concrete justification.

## 4. STRICT FRONTEND AND BACKEND SEPARATION

Frontend and backend responsibilities must be separated logically and consistently.

Do not place the entire application inside large page components or mix UI, business logic, database access, and authorization in the same file.

### 4.1 Frontend Responsibilities

Frontend code is responsible for:

* Rendering pages, layouts, and UI components.
* Handling user interactions and form state.
* Client-side validation for usability.
* Calling authorized backend endpoints.
* Displaying loading states, success messages, and recoverable errors.
* Presenting data returned by the backend.

Frontend code must NOT be trusted to:

* Determine whether a user is an administrator.
* Enforce permissions.
* Validate prices, grades, exam scores, or ownership as the final authority.
* Protect private records.
* Store service-role credentials or other privileged secrets.

Hiding a button or protecting a route in the UI is not authorization.

### 4.2 Backend Responsibilities

Backend code is responsible for:

* Authenticating requests.
* Authorizing every protected operation.
* Validating and normalizing untrusted input.
* Enforcing business rules.
* Performing privileged database operations.
* Checking resource ownership and course enrollment.
* Applying transaction and concurrency safeguards where necessary.
* Returning minimal, well-defined response objects.
* Handling errors without exposing internal details.

Never trust user IDs, roles, grades, course permissions, or ownership values supplied by the client without independently verifying them.

### 4.3 Required Request Flow

Use the following logical flow:

`UI → API / Server Action → Authentication → Authorization → Validation → Service → Database → Response`

Not every read operation needs a custom API endpoint. Authorized Server Components and appropriately secured server-side modules may read data directly. However, all data access must still follow the same security and separation principles.

Use Server Actions only as server entry points with explicit authentication, authorization, and input validation. They must never be treated as automatically secure.

### 4.4 Database Access Rules

* Centralize database access in dedicated server-side modules.
* Do not scatter Supabase queries throughout unrelated UI components.
* Never expose privileged database clients to browser code.
* Use explicit column selections instead of returning entire records unnecessarily.
* Prefer typed database operations and validated data-transfer objects.
* Avoid SQL injection by using parameterized queries and safe query builders.
* Use migrations for schema changes; do not rely on undocumented manual production changes.

## 5. RECOMMENDED PROJECT STRUCTURE

Use a feature-oriented structure with clearly separated frontend, backend, and shared code.

```text
lms/
├── AGENTS.md
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   ├── security.md
│   └── api-contracts.md
├── public/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── login/
│   │   │   └── forgot-password/
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   ├── (teacher)/
│   │   │   └── teacher/
│   │   ├── (student)/
│   │   │   └── student/
│   │   └── api/
│   │       └── v1/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── shared/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── courses/
│   │   │   ├── components/
│   │   │   ├── schemas/
│   │   │   └── types/
│   │   ├── assignments/
│   │   ├── exams/
│   │   ├── submissions/
│   │   └── grades/
│   ├── server/
│   │   ├── auth/
│   │   ├── authorization/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── validation/
│   │   └── security/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── admin.ts
│   │   ├── env.ts
│   │   └── errors.ts
│   └── types/
├── supabase/
│   ├── migrations/
│   ├── seed.sql
│   └── tests/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

Adapt the structure to the existing repository when necessary. Do not create empty directories or files merely to imitate this example.

### 5.1 File Responsibility Rules

* `app/`: Routes, layouts, pages, loading states, and route-level error boundaries.
* `components/ui/`: Reusable presentational UI components.
* `components/layout/`: Shared navigation, sidebar, headers, and dashboard shells.
* `features/<feature>/components/`: Components specific to one feature.
* `features/<feature>/schemas/`: Input schemas and feature-specific validation definitions.
* `features/<feature>/types/`: Feature-specific TypeScript types.
* `server/auth/`: Server-side authentication helpers.
* `server/authorization/`: Reusable permission checks and access policies.
* `server/services/`: Business logic and orchestration.
* `server/repositories/`: Database queries and persistence logic.
* `server/validation/`: Server-side request validation utilities.
* `server/security/`: Security-related helpers that do not belong to a more specific module.
* `lib/supabase/`: Supabase client initialization.
* `supabase/migrations/`: Version-controlled database schema and policy changes.
* `tests/`: Automated tests.

Do not create one generic utility file containing unrelated functionality.

## 6. FILE SIZE AND CODE ORGANIZATION

* Each file should have one clear primary responsibility.
* Aim for approximately 150–250 lines per file as a maintainability guideline, not an absolute limit.
* Split files that combine multiple unrelated responsibilities, contain repeated logic, or become difficult to review.
* Large files may remain larger when splitting them would make the architecture worse.
* Keep React components focused on rendering and interaction.
* Extract complex business logic into services.
* Extract database access into repositories or dedicated server-side data-access modules.
* Extract reusable validation rules into schemas.
* Avoid circular dependencies and deep, unnecessary import chains.
* Prefer named exports where practical and follow the project's established conventions.
* Avoid `any`; use explicit types, generics, or `unknown` with proper narrowing.
* Do not disable TypeScript or ESLint checks merely to make the build pass.
* Do not use `@ts-ignore` or disable security-related lint rules without a documented, justified exception.

## 7. ENVIRONMENT VARIABLES AND SECRET MANAGEMENT

**All secrets must be stored in environment variables. Never hardcode secrets in source code.**

### 7.1 Required Rules

* Use `.env.local` for local development secrets.
* Use the deployment platform's encrypted environment-variable configuration for production secrets.
* Keep `.env.local`, `.env.*.local`, and other secret-bearing files out of Git.
* Commit `.env.example` with variable names and safe placeholder values only.
* Never copy actual credentials into `.env.example`, documentation, tests, screenshots, logs, or commits.
* Validate required environment variables at application startup or during server initialization.
* Fail safely when required configuration is missing.
* Do not log secrets or full authentication tokens.
* Rotate credentials immediately if they are exposed.

### 7.2 Supabase Configuration

Example `.env.example`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use the current Supabase publishable/secret key conventions where appropriate. If the project uses legacy `anon` and `service_role` keys, handle them according to their documented permissions.

Important distinctions:

* `NEXT_PUBLIC_*` variables are exposed to browser bundles and must never contain secrets.
* The Supabase URL and publishable key are intended for public client configuration. They are not substitutes for authorization or RLS.
* The Supabase secret key or legacy service-role key is privileged and must remain server-only.
* Any database password, signing secret, private API key, or privileged token must remain server-only.
* Never import a privileged Supabase client into a Client Component or any module reachable from browser code.
* Add `import 'server-only'` to sensitive server modules where supported.
* Use separate browser and server clients, and follow the current Supabase SSR authentication guidance.
* Do not create a service-role client unless a specific privileged operation requires it.

Never expose private secrets simply because the application needs them to function.

## 8. AUTHENTICATION AND AUTHORIZATION

### 8.1 Authentication

* Use Supabase Auth rather than building custom password storage.
* Never store plaintext passwords.
* Never implement homemade password hashing or session-signing mechanisms.
* Use the supported Supabase SSR pattern for server-side session handling.
* Validate the current user on protected server-side requests.
* Use secure session handling and appropriate cookie settings.
* Implement logout, password recovery, and appropriate session-expiration behavior.
* Do not trust client-provided identity claims without server-side verification.

### 8.2 Role-Based Access Control

Supported roles:

* `admin`
* `teacher`
* `student`

Rules:

* Role assignments must be controlled by an authorized administrative process.
* Public signup must never allow users to assign themselves an admin role.
* Do not accept role changes directly from ordinary profile update requests.
* Store authoritative role information in a trusted database structure or protected authorization mechanism.
* Verify role and resource-level permissions on the server for every protected operation.
* Keep UI role checks separate from actual access enforcement.
* Deny access by default if the role or permission cannot be verified.

### 8.3 Resource-Level Authorization

Examples:

* Teachers can modify only courses they are authorized to manage.
* Students can access only courses in which they are enrolled or otherwise explicitly authorized.
* Students can read only their own private submissions and grades.
* Teachers can grade submissions only within their authorized classes or courses.
* Only authorized administrators can manage users and global settings.
* Private files must be protected by appropriate storage policies or short-lived signed URLs.

Enforce these rules at both the server boundary and database/storage policy boundary where applicable.

## 9. DATABASE SECURITY AND SUPABASE RLS

Enable and configure Row Level Security for tables exposed through Supabase APIs.

* Never assume that hiding a page or button protects database records.
* Create explicit SELECT, INSERT, UPDATE, and DELETE policies as appropriate.
* Use least-privilege access.
* Validate relationships between users, courses, classes, assignments, and submissions.
* Prevent students from modifying their own grades, roles, enrollment privileges, or exam results.
* Prevent users from reading other students' private submissions or personal information.
* Do not expose private tables through unrestricted API access.
* Restrict `SECURITY DEFINER` functions and privileged database functions.
* Review database grants as well as RLS policies.
* Apply equivalent authorization to Storage buckets and file operations.
* Test policies with users representing each role, including unauthorized users.
* Use database constraints, unique indexes, foreign keys, and transactions where necessary to protect data integrity.
* Never disable RLS as a shortcut to make a feature work.

A privileged server client can bypass RLS. Every operation using such a client must perform explicit server-side authorization and validation.

## 10. INPUT VALIDATION AND API SECURITY

Treat all client input, uploaded files, URLs, headers, and request bodies as untrusted.

* Validate inputs on the server using schemas such as Zod.
* Enforce allowed types, maximum lengths, numeric ranges, and valid identifiers.
* Reject unexpected fields when appropriate.
* Use parameterized queries and safe database APIs.
* Prevent SQL injection, cross-site scripting (XSS), and insecure direct object references (IDOR).
* Protect cookie-authenticated state-changing endpoints against CSRF using the framework's protections and appropriate origin/security controls.
* Apply rate limiting to sensitive or abuse-prone operations.
* Avoid leaking internal stack traces, SQL details, tokens, or private records.
* Return consistent error responses and suitable HTTP status codes.
* Use restrictive CORS settings if cross-origin APIs are needed.
* Never use `dangerouslySetInnerHTML` with untrusted content.
* Sanitize rendered rich text using a suitable, maintained sanitizer.
* Do not treat client-side validation as sufficient.

## 11. LMS-SPECIFIC SECURITY REQUIREMENTS

### 11.1 Courses and Learning Materials

* Verify course ownership, teaching assignments, and student enrollment.
* Keep restricted course materials private when necessary.
* Validate uploaded files by size, type, and allowed purpose.
* Do not rely only on file extensions or browser-provided MIME types.
* Prevent unauthorized file replacement, deletion, or downloads.

### 11.2 Assignments and Submissions

* Enforce assignment deadlines on the server.
* Verify that submissions belong to the authenticated student and the correct assignment.
* Validate submission limits and permitted file formats.
* Prevent students from modifying grades or teacher feedback.
* Record relevant timestamps and preserve auditability for grading changes.

### 11.3 Exams and Anti-Cheating

Possible features include:

* Randomized questions and answer choices.
* Server-controlled exam timers and deadlines.
* Attempt limits and submission tracking.
* Logging of tab visibility changes and fullscreen exits.
* Logging of suspicious copy/paste activity when appropriate.
* Teacher review of flagged exam events.

Security requirements:

* Store authoritative exam start times, deadlines, attempt status, and submitted answers on the server.
* Do not trust client-side timers or client-reported timestamps as authoritative.
* Enforce deadlines and attempt limits on the server.
* Prevent students from reading correct answers or answer keys before authorized release.
* Do not expose the entire question bank to the browser when only selected questions are required.
* Randomize questions and answer options on the server when appropriate.
* Prevent duplicate submissions and handle concurrent requests safely.
* Log suspicious activity with appropriate timestamps and attempt identifiers.
* Treat browser events as indicators, not conclusive proof of cheating.
* Do not claim that tab detection, fullscreen, or copy/paste monitoring can prevent all cheating.
* Do not automatically punish students based solely on potentially unreliable browser events.
* Keep exam logs access-controlled and retain them only as long as justified by policy.

### 11.4 Grades and Results

* Calculate authoritative scores on the server.
* Validate all score ranges and grading rules.
* Prevent students from modifying their own results.
* Restrict grade visibility to authorized users.
* Record important grading changes and their authorized actor.
* Protect answer keys and unpublished results from unauthorized access.

## 12. FILE UPLOADS AND STORAGE

* Define maximum upload sizes and allowed file types.
* Validate file content when practical, not just its filename.
* Generate storage object names safely; do not trust client-provided paths.
* Keep sensitive files in private buckets.
* Use short-lived signed URLs when appropriate.
* Enforce per-user and per-resource upload permissions.
* Prevent path traversal and unauthorized object access.
* Avoid serving untrusted uploads as executable content.
* Consider malware scanning for high-risk uploads.
* Do not load entire large files into memory unnecessarily.
* Handle upload failures and cleanup consistently.

## 13. FRONTEND QUALITY AND ACCESSIBILITY

* Use reusable, consistent components.
* Build responsive interfaces for desktop, tablet, and mobile.
* Support keyboard navigation and visible focus states.
* Use accessible labels, semantic HTML, and appropriate ARIA attributes.
* Include loading, empty, error, and success states.
* Prevent accidental duplicate form submissions.
* Avoid exposing private data in browser state, local storage, or URLs.
* Do not store privileged credentials in local storage or session storage.
* Use optimistic updates only when failures can be handled safely.
* Avoid unnecessary client components when server rendering is sufficient.
* Do not make a button look functional if it has no real action.

## 14. ERROR HANDLING AND OBSERVABILITY

* Use consistent error types and response formats.
* Log useful diagnostic information without secrets or unnecessary personal data.
* Never reveal internal errors or stack traces to ordinary users.
* Preserve sufficient audit records for security-sensitive actions.
* Use structured logs where practical.
* Add request or correlation IDs where useful.
* Do not silently catch and ignore errors.
* Handle partial failures explicitly, especially for file uploads, submissions, and grading.
* Do not claim a database operation succeeded until its result has been verified.

## 15. TESTING REQUIREMENTS

Before marking a task complete, run the relevant checks available in the project.

### Required checks

* TypeScript type checking.
* Linting.
* Unit tests for business rules and validation.
* Integration tests for important database and service behavior.
* End-to-end tests for critical user flows.
* Production build.

### Security test scenarios

* Unauthenticated users cannot access protected resources.
* Students cannot access admin or teacher functionality.
* Teachers cannot modify resources outside their authorized scope.
* Students cannot read another student's grades or private submissions.
* Students cannot assign themselves privileged roles.
* Students cannot submit scores or grades directly.
* Expired or invalid exam attempts are rejected server-side.
* RLS policies prevent unauthorized reads and writes.
* Private Storage objects cannot be accessed by unauthorized users.
* Invalid input and unexpected request payloads are rejected safely.

Do not claim tests passed unless they were actually executed and passed.

If a test cannot run because of missing credentials or infrastructure, report the limitation clearly.

## 16. DATABASE MIGRATIONS AND DATA INTEGRITY

* Use version-controlled migrations for schema and policy changes.
* Never modify production schemas without a reviewed migration plan.
* Keep migrations focused and understandable.
* Include required indexes, constraints, foreign keys, and RLS policies.
* Make migrations safe for existing data.
* Avoid destructive migrations without explicit justification and backup considerations.
* Use transactions where supported and appropriate.
* Keep development seed data separate from production data.
* Never put real credentials or sensitive user information in seed files.
* Test migrations against a development database before deployment.

## 17. DEPENDENCY AND SUPPLY-CHAIN SECURITY

* Prefer maintained, reputable packages.
* Avoid unnecessary dependencies and duplicate libraries.
* Check package compatibility before adding or upgrading dependencies.
* Review security advisories and dependency audit results where available.
* Commit the appropriate lockfile.
* Never execute untrusted scripts or commands without inspection.
* Do not disable security controls to resolve dependency problems.
* Use supported, current framework and Supabase documentation for implementation decisions.

## 18. PERFORMANCE AND SCALABILITY

* Paginate large lists and database queries.
* Avoid fetching all records when only a subset is needed.
* Select only required database columns.
* Add indexes for frequently queried and filtered columns where appropriate.
* Avoid N+1 query patterns.
* Keep API response payloads minimal.
* Use caching only when authorization and data freshness remain correct.
* Never share cached private data across users.
* Avoid unnecessary client-side JavaScript.
* Use background processing for tasks that exceed appropriate request limits.
* Apply appropriate timeouts and resource limits.

## 19. DOCUMENTATION REQUIREMENTS

Update documentation when changing:

* Database schemas or relationships.
* API request or response contracts.
* Authentication or authorization behavior.
* Environment variables.
* Deployment configuration.
* Security policies.
* Significant architectural decisions.

Document the purpose of non-obvious security decisions. Avoid duplicating large amounts of information already maintained elsewhere.

## 20. REQUIRED WORKFLOW FOR EVERY TASK

Follow this workflow for each implementation request:

1. **Inspect:** Read relevant code, project instructions, dependencies, and tests.
2. **Plan:** Identify affected files, responsibilities, data flow, authorization rules, and potential risks.
3. **Implement:** Make the smallest complete change consistent with the architecture.
4. **Validate:** Apply server-side validation, authorization, database constraints, and error handling.
5. **Test:** Add or update tests, including negative authorization cases for protected features.
6. **Verify:** Run available lint, type-check, tests, and build commands.
7. **Review:** Inspect the diff for leaked secrets, broken permissions, duplicated code, unrelated modifications, and incomplete functionality.
8. **Report:** Summarize changes, tests actually executed, remaining risks, and incomplete items.

Do not skip security review because a task appears small.

## 21. DEFINITION OF DONE

A feature is complete only when all applicable conditions are met:

* [ ] The feature performs its intended real operation.
* [ ] Frontend and backend responsibilities are separated.
* [ ] Authentication and authorization are enforced server-side.
* [ ] Input is validated on the server.
* [ ] Database access follows least privilege and applicable RLS policies.
* [ ] Sensitive data and secrets are not exposed.
* [ ] Loading, error, and empty states are handled.
* [ ] Relevant tests are added or updated.
* [ ] Type checking, linting, and applicable tests have been run.
* [ ] Documentation and migrations are updated when necessary.
* [ ] No unrelated files or changes were introduced unnecessarily.
* [ ] Known limitations are reported honestly.

## 22. FINAL DIRECTIVE

Security is a requirement, not an optional improvement.

Never sacrifice authorization, privacy, data integrity, or reliable behavior to finish a feature faster.

Never assume that frontend controls, hidden routes, TypeScript types, or environment-variable naming alone make a system secure.

Every protected operation must be enforced by a trusted server or database policy. Every secret must remain in an appropriate secret store. Every important feature must be tested against both legitimate and unauthorized use.

When uncertain, inspect the existing implementation, consult current official documentation, choose the least-privileged safe design, and explain unresolved risks before proceeding.
