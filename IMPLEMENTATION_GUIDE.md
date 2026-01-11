# Implementation Guide: 004-auth-persistence-ui

This guide provides step-by-step instructions for implementing the feature using Claude Code agents or manual development.

## Quick Start

All tasks are defined in `specs/004-auth-persistence-ui/tasks.md` (107 tasks total).

## Architecture Overview

```
Frontend (Next.js 15)          Backend (FastAPI)           Database (Neon)
├── /signup                    ├── POST /auth/signup       ├── users table
├── /login                     ├── POST /auth/login        └── tasks table
├── /dashboard (protected)     ├── POST /auth/logout
├── TaskDashboard              ├── GET /tasks
├── AuthForm                   ├── POST /tasks
└── NavBar                     ├── PUT /tasks/{id}
                               ├── DELETE /tasks/{id}
                               ├── PATCH /tasks/{id}/toggle
                               └── JWT middleware
```

## Foundation Setup (Phase 1-2: Must Complete First)

### Backend Foundation

1. **Database Models** (`backend/src/models/`)
   - `user.py`: User model with id, email (unique), password_hash, created_at
   - `task.py`: Task model with id, title, completed, user_id (FK), created_at

2. **Database Connection** (`backend/src/database.py`)
   - SQLAlchemy engine with Neon DATABASE_URL
   - SessionLocal factory
   - create_all() on startup

3. **Authentication** (`backend/src/auth/`)
   - `jwt.py`: Token generation/verification with user_id claim
   - `passwords.py`: Bcrypt hashing for password validation

4. **Middleware** (`backend/src/middleware/auth.py`)
   - FastAPI Depends() that extracts user_id from JWT

5. **API Setup** (`backend/src/main.py`)
   - FastAPI app with CORS
   - Exception handlers for 401, 403, 422, 500
   - Router registration

### Frontend Foundation

1. **Auth Client** (`frontend/src/lib/auth-client.ts`)
   - Better Auth configuration with BETTER_AUTH_SECRET
   - JWT in httpOnly cookies

2. **API Client** (`frontend/src/lib/api-client.ts`)
   - Centralized fetch that injects JWT to all requests
   - 401 redirect to login

3. **Middleware** (`frontend/src/middleware.ts`)
   - Protect /dashboard route

## Implementation Phases

### Phase 1: Database & Authentication (Days 1-2)

**Backend Tasks**: T004-T011 (8 tasks)
- Create User and Task models
- Setup database connection
- Implement JWT generation/verification
- Implement password hashing
- Create JWT middleware

**Frontend Tasks**: T016-T017 (2 tasks)
- Setup Better Auth client
- Setup centralized API client

### Phase 2: Auth Endpoints (Days 2-3)

**Backend Tasks**: T018-T022, T029-T033 (10 tasks)
- POST /auth/signup: Create user, hash password, return JWT
- POST /auth/login: Validate credentials, return JWT
- POST /auth/logout: Clear session

**Frontend Tasks**: T023-T028, T034-T037 (9 tasks)
- Create signup page
- Create login page
- Implement AuthForm component
- Add form validation
- Add API integration

### Phase 3: Task Management (Days 3-5)

**Backend Tasks**: T038-T051 (14 tasks)
- TaskService with CRUD methods
- All task endpoints with user_id filtering
- Authorization checks (403 for cross-user access)

**Frontend Tasks**: T052-T062 (11 tasks)
- TaskDashboard component
- TaskItem component
- useTasks hook
- Task create/update/delete/toggle UI
- Empty state and loading states

### Phase 4: Route Protection & Authorization (Days 5-6)

**Backend Tasks**: T063-T067 (5 tasks)
- Update JWT middleware
- Add authorization checks

**Frontend Tasks**: T068-T073 (6 tasks)
- Middleware for /dashboard protection
- 401 error handling in API client
- Home page redirect logic

### Phase 5: Logout & UI Polish (Days 6-7)

**Backend Tasks**: T074 (1 task)
- POST /auth/logout endpoint

**Frontend Tasks**: T075-T098 (24 tasks)
- NavBar with logout button
- UI component library
- Responsive design
- Error/loading/empty states
- Mobile optimization

### Phase 6: Integration & Testing (Day 7)

**Tasks**: T099-T107 (9 tasks)
- Integration tests
- Documentation
- Performance verification
- Security validation

## File Structure

```
backend/
├── src/
│   ├── main.py                           (FastAPI app + router setup)
│   ├── database.py                       (SQLAlchemy connection)
│   ├── models/
│   │   ├── user.py                       (User SQLModel)
│   │   └── task.py                       (Task SQLModel)
│   ├── auth/
│   │   ├── jwt.py                        (JWT generation + verification)
│   │   └── passwords.py                  (Bcrypt hashing)
│   ├── middleware/
│   │   └── auth.py                       (JWT dependency injection)
│   ├── api/
│   │   ├── auth.py                       (signup, login, logout endpoints)
│   │   ├── tasks.py                      (CRUD + toggle endpoints)
│   │   └── schemas.py                    (Pydantic request/response models)
│   ├── services/
│   │   ├── user_service.py               (User creation + authentication)
│   │   └── task_service.py               (Task CRUD + authorization)
│   └── tests/
│       ├── test_auth.py                  (Auth flow tests)
│       └── test_tasks.py                 (Task CRUD tests)
│
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    (Root layout with providers)
│   │   ├── page.tsx                      (Home → redirect)
│   │   ├── signup/page.tsx               (Signup page)
│   │   ├── login/page.tsx                (Login page)
│   │   ├── dashboard/page.tsx            (Task management)
│   │   └── middleware.ts                 (Route protection)
│   ├── components/
│   │   ├── AuthForm.tsx                  (Signup/login form)
│   │   ├── TaskDashboard.tsx             (Task list + create)
│   │   ├── TaskItem.tsx                  (Individual task)
│   │   ├── NavBar.tsx                    (Header + logout)
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Card.tsx
│   ├── lib/
│   │   ├── api-client.ts                 (Centralized fetch + JWT)
│   │   ├── auth-client.ts                (Better Auth config)
│   │   └── api.ts                        (API helper functions)
│   ├── hooks/
│   │   ├── useTasks.ts                   (React Query task operations)
│   │   └── useAuth.ts                    (Auth context)
│   └── types/
│       └── index.ts                      (TypeScript types)
```

## Environment Variables

**`.env.example` (Already exists in repo)**:
```
DATABASE_URL=postgresql://...  # Neon connection
BETTER_AUTH_SECRET=...          # Shared JWT secret
BETTER_AUTH_URL=http://localhost:3000
API_SECRET_KEY=...              # Backend session secret
```

## Running Locally

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env       # Configure DATABASE_URL + BETTER_AUTH_SECRET
python -m uvicorn src.main:app --reload

# Terminal 2: Frontend
cd frontend
npm install
cp .env.example .env.local # Configure environment
npm run dev
```

Then visit: `http://localhost:3000/signup`

## Testing the Implementation

### Manual Flow Test

1. **Signup**: Navigate to `/signup`, fill form, submit
   - Verify redirect to `/dashboard`
   - Check JWT in browser cookies (DevTools → Application → Cookies)
   - Verify user in Neon database

2. **Create Task**: On dashboard, create a task
   - Verify task appears in list
   - Check task in database
   - Refresh page, verify task persists

3. **Login**: Logout, then login with same credentials
   - Verify redirect to `/dashboard`
   - Verify tasks are visible

4. **Authorization**: Open DevTools, delete JWT cookie, try to access `/dashboard`
   - Verify redirect to `/login`

5. **Cross-User Isolation**: Create 2nd user, verify first user's tasks not visible

### Automated Tests (Optional)

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests (React Testing Library)
cd frontend
npm test
```

## Debugging Tips

### Common Issues

1. **Database Connection Error**
   - Verify DATABASE_URL in `.env`
   - Check Neon dashboard for connection pool status
   - Ensure SSL mode is enabled

2. **JWT Verification Fails**
   - Verify BETTER_AUTH_SECRET matches frontend and backend
   - Check token expiration (24 hours from issue)
   - Verify Authorization header format: `Bearer <token>`

3. **CORS Errors**
   - Ensure CORS middleware in FastAPI allows frontend origin
   - Check browser console for detailed error

4. **Tasks Not Showing**
   - Verify GET /tasks endpoint returns user_id filtered list
   - Check JWT is being sent with request (DevTools Network tab)
   - Verify user_id in JWT matches task owner_id in database

## Success Indicators

✅ User can signup and login
✅ JWT tokens issued and verified
✅ Tasks persist in database
✅ Users see only their own tasks
✅ 401 responses on invalid JWT
✅ Responsive UI on mobile/tablet/desktop
✅ Error messages display clearly
✅ Loading states show during API calls
✅ Empty state shown when no tasks

## Performance Targets

- Signup/login endpoint: <2 seconds response time
- Dashboard page load: <1 second after login
- JWT verification overhead: <10ms per request

## Next Steps

1. Review `specs/004-auth-persistence-ui/tasks.md` for detailed task breakdown
2. Execute tasks in order (Phase 1 → Phase 2 → Phase 3, etc.)
3. Test each user story independently
4. Run integration tests before final deployment

---

**Status**: Implementation ready. Follow the phases above or use specialized agents for faster development.
