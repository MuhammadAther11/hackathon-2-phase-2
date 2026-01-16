# Implementation Plan: Frontend Fix & Deployment Ready

**Branch**: `005-frontend-fix-deploy` | **Date**: 2026-01-15 | **Spec**: [specs/005-frontend-fix-deploy/spec.md](spec.md)
**Input**: Feature specification from `/specs/005-frontend-fix-deploy/spec.md`

## Summary

Fix and stabilize the Next.js frontend for production deployment on Vercel. Address authentication input bugs, task management errors, UI/UX polish, and add a public landing page. Ensure zero build errors and 100% of critical user journeys work end-to-end with proper error handling and state synchronization.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15 (App Router), React 19+
**Primary Dependencies**: React Query (@tanstack/react-query), Tailwind CSS, Lucide React, Better Auth, Next.js
**Storage**: Neon PostgreSQL (backend-managed)
**Testing**: Jest + React Testing Library (build validation focus)
**Target Platform**: Web browser (Vercel deployment)
**Project Type**: Frontend web application (Next.js)
**Performance Goals**: Page load < 2 seconds, task operations < 2 seconds, responsive 320px–1920px
**Constraints**: Zero build errors on `next build`, zero runtime errors on Vercel, JWT token management
**Scale/Scope**: Single tenant, multi-user via auth isolation, ~5-10 UI components, ~15 files to modify/create

## Constitution Check

**GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.**

- [x] **Security**: Strict JWT isolation enforced via `apiFetch` middleware and protected routes via `middleware.ts`
- [x] **Accuracy**: React Query ensures state sync with backend; optimistic updates invalidate cache on success
- [x] **Reliability**: Error handling via try-catch, 401 detection with redirect, toast notifications for user feedback
- [x] **Usability**: Tailwind responsive classes, mobile-first design, loading/error states visible to user
- [x] **Reproducibility**: `.env.example` documents `NEXT_PUBLIC_API_URL`; all config via environment variables

**✅ All checks passed. Proceeding to Phase 0.**

## Project Structure

### Documentation (this feature)

```text
specs/005-frontend-fix-deploy/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output - Clarifications and dependencies resolved
├── data-model.md        # Phase 1 output - Frontend component hierarchy and state
├── quickstart.md        # Phase 1 output - Dev environment setup guide
├── contracts/           # Phase 1 output - API contract specs
│   ├── auth-flow.md
│   └── task-operations.md
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (needs fixes)
│   │   ├── page.tsx                   # Landing page (NEW - currently redirects)
│   │   ├── login/
│   │   │   └── page.tsx               # Login page (fix input bugs)
│   │   ├── signup/
│   │   │   └── page.tsx               # Signup page (fix input bugs)
│   │   ├── dashboard/
│   │   │   └── page.tsx               # Dashboard (protect, fix state sync)
│   │   └── api/
│   │       └── auth/
│   │           └── route.ts           # Auth proxy endpoint
│   ├── components/
│   │   ├── AuthForm.tsx               # Login/signup form (fix input handling)
│   │   ├── TaskDashboard.tsx          # Task CRUD UI (fix error handling)
│   │   ├── TaskItem.tsx               # Individual task row (fix state sync)
│   │   ├── NavBar.tsx                 # Navigation (logout cleanup)
│   │   └── ui/                        # Shadcn/radix components (update as needed)
│   ├── hooks/
│   │   └── useTasks.ts                # Task mutations and queries (fix JSON parse)
│   ├── lib/
│   │   ├── api-client.ts              # Centralized API fetch with JWT injection (verify)
│   │   ├── auth-client.ts             # Better Auth wrapper (verify token storage)
│   │   ├── providers.tsx              # React Query + Toast provider setup
│   │   └── utils.ts                   # Utility functions
│   ├── middleware.ts                  # Route protection via auth cookie check
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   └── test/
│       └── setup.ts                   # Jest configuration

backend/
├── src/
│   ├── api/
│   │   ├── auth.py                    # Auth endpoints (ensure proper 401 handling)
│   │   └── tasks.py                   # Task CRUD endpoints (ensure response format)
│   ├── middleware/
│   │   └── auth.py                    # JWT verification middleware
│   └── main.py                        # FastAPI app setup

.env.example                           # Environment template
next.config.ts                         # Next.js configuration
tailwind.config.ts                     # Tailwind CSS configuration
```

**Structure Decision**: Web application with separate frontend (Next.js) and backend (FastAPI) directories. Frontend is the focus of this feature; backend interactions verified but not modified (assumes backend is stable from previous features).

## Complexity Tracking

No Constitution Check violations identified. All decisions align with core principles:
- JWT security via centralized `apiFetch` middleware
- State sync via React Query invalidation
- Error boundaries and 401 handling built-in
- Responsive design via Tailwind utility classes
- Documentation via environment variables and code comments

## Phase 0: Research & Clarifications

### Research Tasks

1. **Confirm Better Auth Token Storage**
   - Current: `auth-client.ts` uses `authClient.getSession()`
   - Need: Verify token is persisted in localStorage or cookies during auth flow
   - Impact: Affects middleware.ts ability to detect auth state on server

2. **Verify API Response Format**
   - Current: Backend endpoints may return empty body on success (204 No Content)
   - Need: Confirm all endpoints return 200 + JSON or 204 with no body
   - Impact: `apiFetch` JSON parsing must handle both cases

3. **Validate Middleware Cookie Behavior**
   - Current: `middleware.ts` checks `auth_token` cookie
   - Need: Verify Better Auth sets this cookie or if we need to sync from localStorage
   - Impact: Server-side route protection depends on cookie presence

4. **Check Next.js Build & Vercel Compatibility**
   - Current: Unknown build warnings/errors
   - Need: Run `next build` and capture TypeScript + build errors
   - Impact: Fix all errors before Vercel deployment

### Dependency & Best Practices

1. **React Query Patterns** (verified present)
   - Centralized fetch function: ✅ `apiFetch` exists
   - Query invalidation on mutation: ✅ `useTasks` uses `invalidateQueries`
   - Error boundary: ✅ `useToast` provider in place

2. **Next.js 15 Server vs Client Components**
   - All interactive components marked `"use client"`: Need to verify
   - Root layout may need Server Component: Check for necessary exports
   - Middleware protection: ✅ `middleware.ts` exists

3. **Tailwind CSS Responsive Design**
   - Mobile-first approach: ✅ Classes use `sm:`, `md:` breakpoints
   - Accessibility: Need to verify ARIA labels and focus states

### Research Output

See `research.md` for detailed findings and decisions.

## Phase 1: Design & Contracts

### 1.1 Data Model (Frontend State)

**Component Hierarchy**:
```
RootLayout (Server + Client boundary)
  ├── ToastProvider (Client)
  ├── QueryClientProvider (Client)
  └── PageContent
      ├── AuthForm (Client) — email, password, name state, errors
      ├── TaskDashboard (Client) — tasks array, newTitle input, mutations
      │   └── TaskItem × N (Client) — individual task state + handlers
      ├── NavBar (Client) — user info, logout handler
      └── LandingPage (Client) — CTA buttons for login/signup
```

**State Management**:
- **Auth State**: Managed by Better Auth client library → localStorage
- **Tasks**: Managed by React Query → server state cache
- **UI Feedback**: Toast notifications via context provider
- **Loading States**: Mutation isPending flags from React Query

**Data Flow**:
1. User submits AuthForm → `signIn.email()` → token stored → localStorage
2. `middleware.ts` reads auth cookie → allows access to `/dashboard`
3. `useTasks` query fires → `apiFetch("/tasks")` injects JWT → fetches backend
4. User creates task → `createTask.mutate()` → POST → cache invalidation → refetch
5. Error (401) → `apiFetch` detects → redirects to login → clears token

### 1.2 API Contracts

**Auth Flow**:
```
POST /auth/signup
  Request: { email, password, name }
  Response: { token, user: { id, email, name } } | { error: "..." }
  Error: 400 (validation), 409 (user exists)

POST /auth/login
  Request: { email, password }
  Response: { token, user: { id, email, name } } | { error: "..." }
  Error: 401 (invalid credentials)

GET /auth/logout (if backend has)
  Response: { success: true }
  Error: none expected
```

**Task Operations**:
```
GET /tasks/
  Response: [{ id, title, description, completed, created_at, updated_at }, ...]
  Error: 401 (no token), 500 (database error)

POST /tasks/
  Request: { title, description? }
  Response: { id, title, description, completed, created_at, updated_at } | { error: "..." }
  Error: 401, 400 (validation), 500

PUT /tasks/{id}
  Request: { title?, description? }
  Response: { id, title, description, completed, created_at, updated_at } | { error: "..." }
  Error: 401, 404 (not found), 500

PATCH /tasks/{id}/toggle
  Request: {} (body may be empty)
  Response: { id, ..., completed: boolean } | { error: "..." }
  Error: 401, 404, 500

DELETE /tasks/{id}
  Request: {} (no body)
  Response: {} (empty 200) or { success: true }
  Error: 401, 404, 500
```

**Handling Empty Responses**:
- If 204 No Content: `apiFetch` must return `null` or skip JSON parsing
- If 200 with no body: Handle gracefully (query invalidation still fires)

**Error Responses**:
- 401: Redirect to `/login`, clear token
- 400/422: Show error message in toast
- 500: Show generic "Server error, try again" message
- Network timeout: Show "Connection lost" message

### 1.3 Component Fixes & New Components

**Components to Fix**:
1. **AuthForm.tsx**: Remove Enter key navigation logic, use controlled inputs correctly
2. **TaskDashboard.tsx**: Add error handling, verify loading states
3. **TaskItem.tsx**: Ensure toggle/delete mutations properly sync state
4. **useTasks.ts**: Handle empty response bodies in mutations
5. **api-client.ts**: Verify empty response handling, 401 redirect

**Components to Create/Improve**:
1. **LandingPage** (new `src/app/page.tsx`): Public landing page with CTA buttons
2. **NavBar.tsx**: Ensure logout clears token and redirects
3. **middleware.ts**: Verify auth cookie check works across page navigations

### 1.4 Quickstart Guide

See `quickstart.md` for environment setup, running locally, and deployment steps.

---

## Phase 0 Output

**Generated Artifacts**:
- `research.md` — All clarifications resolved
- `data-model.md` — Frontend state model and component hierarchy
- `contracts/auth-flow.md` — Auth API specification
- `contracts/task-operations.md` — Task CRUD API specification

## Phase 1 Completion Checklist

- [x] Data model defined (component hierarchy, state flows)
- [x] API contracts specified (all endpoints, request/response formats)
- [x] Component structure identified (fixes needed, new components)
- [x] Error handling strategy defined (401, 400, 500, network errors)
- [x] Responsive design confirmed (Tailwind breakpoints in place)
- [ ] **Next Step**: Run `/sp.tasks` to generate task-by-task implementation breakdown

---

## Key Decisions & Rationale

| Decision | Why | Alternatives Rejected |
|----------|-----|----------------------|
| **Centralized `apiFetch` middleware** | Automatic JWT injection, consistent error handling, single point for 401 logic | Multiple fetch wrappers would duplicate code |
| **React Query for state sync** | Optimistic updates, automatic cache invalidation, built-in loading/error states | Manual fetch + useState would require more boilerplate |
| **Tailwind CSS for responsive design** | Utility-first, mobile-first by default, integrates with shadcn/radix | Custom CSS or Bootstrap would add complexity |
| **Better Auth for JWT management** | Secure token storage (HTTP-only cookies or localStorage), simple API | Manual JWT handling is error-prone |
| **Landing page at `/` for unauthenticated** | Standard SPA pattern, improves discoverability | Always redirect to login is less user-friendly |
| **Middleware for route protection** | Server-side protection before component loads | Client-side only protection is less secure |

---

## Architectural Decision Suggestion

📋 **Architectural decision detected**: Frontend state management strategy using React Query + Better Auth for JWT persistence.

**Rationale**:
- React Query provides production-grade data fetching and caching
- Better Auth handles JWT lifecycle securely
- Combination avoids manual state management complexity
- Follows industry best practices for web SPAs

**Alternatives Considered**:
- Redux + manual fetch: More boilerplate, overkill for this scale
- Zustand + manual JWT: Lighter but less feature-complete
- Context + useState: Insufficient for async state and cache invalidation

**Impact**: Establishes pattern for all future frontend features; affects auth middleware and API client design.

Would you like me to document this as an ADR? Run `/sp.adr frontend-state-management` if yes.

---

## Next Steps

1. ✅ **Phase 0 Complete**: Research clarifications resolved in this document
2. ⏭️ **Phase 1 Complete**: Data model and contracts defined (above)
3. 📋 **Phase 2 Ready**: Run `/sp.tasks` to generate actionable task list with dependencies
4. 🚀 **Phase 3 (Future)**: Execute tasks and commit to branch

---

## Summary of Changes Required

### Frontend Changes (High Priority - P1)

1. **Authentication Input Bug Fix**
   - Remove Enter key navigation, fix input event handling
   - Ensure controlled inputs update state correctly
   - Add "use client" to all interactive components

2. **Task State Sync**
   - Fix JSON parsing for empty response bodies
   - Ensure UI updates after create/update/delete/toggle
   - Add loading and error feedback

3. **Protected Routes**
   - Verify middleware.ts checks for auth token correctly
   - Test redirect flow on 401

4. **Centralized API Client**
   - Confirm JWT injection in all requests
   - Verify error handling and 401 detection

### Frontend Changes (Medium Priority - P2)

5. **UI/UX Improvements**
   - Polish component styling and transitions
   - Ensure responsive layout on mobile and desktop
   - Add accessibility (ARIA labels, focus states)

6. **Landing Page**
   - Create public landing page with login/signup CTAs
   - No auth required to view

### Frontend Changes (Build Quality)

7. **Build Error Resolution**
   - Fix TypeScript errors
   - Resolve Next.js build warnings
   - Ensure `next build` passes with zero errors

8. **Vercel Deployment**
   - Configure environment variables on Vercel
   - Test deployment process
   - Verify zero runtime errors

---

## Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| **Empty response parsing crashes app** | High | Critical (app unusable) | Add null checks in JSON parsing, test with backend |
| **Token not persisted between page reloads** | Medium | High (auth loop) | Verify localStorage/cookie setup in auth-client |
| **Build errors on Vercel** | Medium | High (deployment fails) | Run `next build` locally, fix TypeScript errors first |
| **401 redirect loops user** | Low | High (UX broken) | Test 401 handling in apiFetch, verify redirect target |
| **Responsive layout breaks on mobile** | Low | Medium (user frustration) | Test on multiple devices, use browser DevTools |

**Kill Switch**: If critical auth error occurs, revert to previous working commit and start debugging in local environment.

---

**Created**: 2026-01-15 | **Status**: Phase 0-1 Complete, Ready for Phase 2 (Task Generation)
