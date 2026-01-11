# Testing Guide: 004-auth-persistence-ui

Complete testing strategy for validating all 6 user stories and ensuring production readiness.

## Manual Testing Flow (Phase 9)

### Test Environment Setup

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn src.main:app --reload

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Terminal 3: Test commands
cd ..  # project root
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## User Story 1: New User Signup (P1 - CRITICAL)

**Test Case 1.1: Successful Signup**
- [ ] Navigate to http://localhost:3000/signup
- [ ] Fill form: email=test@example.com, password=password123
- [ ] Click "Sign Up"
- [ ] Expected: Redirect to /dashboard
- [ ] Verify:
  - JWT cookie present (DevTools → Application → Cookies)
  - User record in database: `SELECT * FROM user WHERE email='test@example.com'`

**Test Case 1.2: Signup with Invalid Email**
- [ ] Navigate to /signup
- [ ] Fill form: email=invalid-email, password=password123
- [ ] Click "Sign Up"
- [ ] Expected: Error message "Invalid email" appears below email field
- [ ] Form remains on /signup page

**Test Case 1.3: Signup with Short Password**
- [ ] Navigate to /signup
- [ ] Fill form: email=test2@example.com, password=short
- [ ] Click "Sign Up"
- [ ] Expected: Error "Password must be 8+ characters"
- [ ] Form remains on /signup page

**Test Case 1.4: Signup with Duplicate Email**
- [ ] Create first user: test@example.com
- [ ] Logout
- [ ] Try to signup again with test@example.com
- [ ] Expected: Error "Email already registered"
- [ ] Form remains on /signup page

**Test Case 1.5: Signup Session Persistence**
- [ ] Signup as user1
- [ ] Refresh page (F5)
- [ ] Expected: Still on /dashboard (session persists)
- [ ] Verify JWT still in cookies

---

## User Story 2: Existing User Login (P1 - CRITICAL)

**Test Case 2.1: Successful Login**
- [ ] Create user via signup: user1@example.com / password123
- [ ] Logout (clear cookies)
- [ ] Navigate to /login
- [ ] Fill form: user1@example.com / password123
- [ ] Click "Login"
- [ ] Expected: Redirect to /dashboard
- [ ] Verify: JWT cookie present

**Test Case 2.2: Login with Invalid Email**
- [ ] Navigate to /login
- [ ] Fill form: nonexistent@example.com / password123
- [ ] Click "Login"
- [ ] Expected: Error message "Invalid email or password"
- [ ] Form remains on /login page (don't differentiate between email/password)

**Test Case 2.3: Login with Wrong Password**
- [ ] Navigate to /login
- [ ] Fill form: user1@example.com / wrongpassword
- [ ] Click "Login"
- [ ] Expected: Error "Invalid email or password"
- [ ] Form remains on /login page

**Test Case 2.4: Login Session Persistence**
- [ ] Login successfully
- [ ] Refresh page
- [ ] Expected: Still on /dashboard
- [ ] Refresh again, expected: Still authenticated

---

## User Story 3: View and Manage Tasks (P1 - CRITICAL)

**Test Case 3.1: Create Task**
- [ ] Login as user1
- [ ] On /dashboard, find "Create Task" input
- [ ] Type "Buy groceries"
- [ ] Click "Add" or press Enter
- [ ] Expected: Task appears in list
- [ ] Verify: Task in database: `SELECT * FROM task WHERE title='Buy groceries' AND user_id=<user1_id>`

**Test Case 3.2: View Tasks After Refresh**
- [ ] Create 3 tasks as user1
- [ ] Refresh page (F5)
- [ ] Expected: All 3 tasks still visible
- [ ] Verify: Database shows all tasks

**Test Case 3.3: Toggle Task Completion**
- [ ] Create task "Complete project"
- [ ] Click checkbox to mark as complete
- [ ] Expected: Task visually shows as completed (strikethrough, gray color)
- [ ] Refresh page
- [ ] Expected: Task still marked as completed
- [ ] Verify: Database shows `completed=true`

**Test Case 3.4: Edit Task Title**
- [ ] Create task "Old title"
- [ ] Click edit button (pencil icon)
- [ ] Change to "New title"
- [ ] Click save
- [ ] Expected: Task shows "New title"
- [ ] Refresh page
- [ ] Expected: Task still shows "New title"

**Test Case 3.5: Delete Task**
- [ ] Create task "To delete"
- [ ] Click delete button (trash icon)
- [ ] Confirm deletion
- [ ] Expected: Task removed from list
- [ ] Refresh page
- [ ] Expected: Task still gone
- [ ] Verify: Database shows 0 tasks with that title

**Test Case 3.6: Empty State**
- [ ] Create new user via signup
- [ ] Redirect to /dashboard
- [ ] Expected: Message "No tasks yet. Create your first task!"
- [ ] Create one task
- [ ] Expected: Message disappears, task appears

**Test Case 3.7: Task List Shows Only User's Tasks**
- [ ] Login as user1, create tasks: "Task1", "Task2"
- [ ] Logout
- [ ] Login as user2 (different user), create: "Task3", "Task4"
- [ ] Expected: User2 sees only "Task3" and "Task4", NOT user1's tasks
- [ ] Go back to user1, expected: Still see only "Task1" and "Task2"

---

## User Story 4: Protected Routes and Unauthorized Access (P1 - CRITICAL)

**Test Case 4.1: Access /dashboard Without JWT**
- [ ] Clear all cookies (DevTools → Delete all cookies for domain)
- [ ] Navigate to http://localhost:3000/dashboard
- [ ] Expected: Redirect to /login
- [ ] URL should show /login

**Test Case 4.2: API Call Without JWT**
- [ ] Open DevTools Console
- [ ] Run: `fetch('http://localhost:8000/tasks')`
- [ ] Expected: Response status 401 Unauthorized
- [ ] Response body: `{"detail": "Invalid or expired token"}`

**Test Case 4.3: API Call with Invalid JWT**
- [ ] Set invalid cookie: `document.cookie = "auth_token=invalid_jwt"`
- [ ] Call: `fetch('http://localhost:8000/tasks')`
- [ ] Expected: 401 Unauthorized

**Test Case 4.4: Cross-User Task Access (Attempt)**
- [ ] Login as user1, create task with ID "task123"
- [ ] Get user2's task ID (console or database)
- [ ] Try: `fetch('http://localhost:8000/tasks/user2_task_id', {method: 'DELETE'})`
- [ ] Expected: 403 Forbidden
- [ ] Error: "You don't have permission"

**Test Case 4.5: 401 Redirect on API Error**
- [ ] Login as user1
- [ ] Manually invalidate JWT: `document.cookie = "auth_token=invalid"`
- [ ] Try to create a task on dashboard
- [ ] Expected: API returns 401, frontend redirects to /login
- [ ] URL changes to /login

---

## User Story 5: Logout (P2 - ENHANCEMENT)

**Test Case 5.1: Logout Clears Session**
- [ ] Login as user1
- [ ] On /dashboard, click "Logout" button
- [ ] Expected: Redirect to /login
- [ ] Verify: JWT cookie is cleared
  - DevTools → Application → Cookies → auth_token should be gone
- [ ] Try to access /dashboard
- [ ] Expected: Redirect to /login again

**Test Case 5.2: Logout & Login as Different User**
- [ ] Login as user1, create task "User1Task"
- [ ] Logout
- [ ] Login as user2, create task "User2Task"
- [ ] Expected: See only "User2Task", not "User1Task"

---

## User Story 6: Responsive UI and Professional Appearance (P2 - ENHANCEMENT)

**Test Case 6.1: Mobile Responsiveness (375px)**
- [ ] DevTools: Set viewport to 375px width (iPhone SE)
- [ ] Navigate to /signup
- [ ] Expected:
  - Form centered and full width (with padding)
  - Input fields readable
  - Buttons clickable (min 44px height)
  - No horizontal scroll
- [ ] Repeat for /login, /dashboard

**Test Case 6.2: Tablet Responsiveness (768px)**
- [ ] DevTools: Set viewport to 768px (iPad)
- [ ] Navigate to /dashboard
- [ ] Expected:
  - Layout adjusts (possibly 2-column if applicable)
  - Task list readable
  - All interactive elements accessible

**Test Case 6.3: Desktop Responsiveness (1920px)**
- [ ] DevTools: Set viewport to 1920px (full HD)
- [ ] Navigate to /dashboard
- [ ] Expected:
  - Full-featured layout
  - Content has max-width (not stretched across full screen)
  - Professional appearance

**Test Case 6.4: Form Validation Errors Display**
- [ ] Go to /signup
- [ ] Try email: "invalid"
- [ ] Expected: Error appears inline: "Invalid email"
- [ ] Try password: "123"
- [ ] Expected: Error appears inline: "Password must be 8+ characters"
- [ ] Both errors disappear when corrected

**Test Case 6.5: Loading States**
- [ ] Add throttle in DevTools (Network → Slow 3G)
- [ ] On /signup, fill form and click "Sign Up"
- [ ] During submission:
  - Expected: Button disabled
  - Expected: Spinner appears
  - Expected: Button text changes to "Loading..."
- [ ] After response, loading state clears

**Test Case 6.6: Error Toast/Message Display**
- [ ] On /dashboard, try to create task with empty title
- [ ] Expected: Error message displays (not console error)
- [ ] Try to delete task, then immediately delete again (before refresh)
- [ ] Expected: Error message "Task not found"

---

## Backend API Verification

### Authentication Endpoints

**POST /auth/signup**
```bash
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```
Expected: 201 Created, JWT in response or Set-Cookie header

**POST /auth/login**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```
Expected: 200 OK, JWT in response

**POST /auth/logout**
```bash
curl -X POST http://localhost:8000/auth/logout \
  -H "Authorization: Bearer <jwt_token>"
```
Expected: 200 OK

### Task Endpoints

**GET /tasks**
```bash
curl -X GET http://localhost:8000/tasks \
  -H "Authorization: Bearer <jwt_token>"
```
Expected: 200 OK, list of user's tasks

**POST /tasks**
```bash
curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My task"}'
```
Expected: 201 Created

**PUT /tasks/{task_id}**
```bash
curl -X PUT http://localhost:8000/tasks/<task_id> \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated title", "completed": true}'
```
Expected: 200 OK

**DELETE /tasks/{task_id}**
```bash
curl -X DELETE http://localhost:8000/tasks/<task_id> \
  -H "Authorization: Bearer <jwt_token>"
```
Expected: 204 No Content

**PATCH /tasks/{task_id}/toggle**
```bash
curl -X PATCH http://localhost:8000/tasks/<task_id>/toggle \
  -H "Authorization: Bearer <jwt_token>"
```
Expected: 200 OK with toggled task

---

## Performance Testing

### Response Times (Target: <2s auth, <1s dashboard)

```bash
# Measure signup
time curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "perf@test.com", "password": "password123"}'

# Measure task fetch (multiple tasks)
# Create 100 tasks, then measure GET /tasks
time curl -X GET http://localhost:8000/tasks \
  -H "Authorization: Bearer <jwt_token>"
```

Target: All under 2 seconds on localhost

---

## Security Testing

### JWT Verification

- [ ] Invalid JWT returns 401
- [ ] Missing JWT returns 401
- [ ] Expired JWT returns 401
- [ ] Tampered JWT returns 401

### User Isolation

- [ ] User A cannot see User B's tasks
- [ ] User A cannot edit User B's tasks
- [ ] User A cannot delete User B's tasks
- [ ] API returns 403 for cross-user access

### Password Security

- [ ] Passwords hashed with bcrypt (never plaintext in DB)
- [ ] Login error doesn't differentiate between invalid email vs password (for security)

---

## Database Validation

```sql
-- Check users table
SELECT COUNT(*) FROM "user";
SELECT id, email, created_at FROM "user" LIMIT 5;

-- Check tasks table
SELECT COUNT(*) FROM task;
SELECT id, title, completed, user_id, created_at FROM task LIMIT 5;

-- Verify user isolation
SELECT * FROM task WHERE user_id = '<user1_id>';
SELECT * FROM task WHERE user_id = '<user2_id>';

-- Check password hashing (should be long bcrypt hash)
SELECT email, LENGTH(password_hash) as hash_length FROM "user";
```

---

## Integration Test: Complete User Journey

**Flow**: Signup → Create Tasks → Login Again → View Tasks → Logout

```bash
# 1. Signup
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "journey@test.com", "password": "password123"}' \
  -c cookies.txt

# 2. Create task
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test task"}' \
  -b cookies.txt

# 3. Get tasks
curl -X GET http://localhost:8000/tasks -b cookies.txt

# 4. Clear cookies (simulate logout + browser close)
# (delete cookies.txt)

# 5. Login again
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "journey@test.com", "password": "password123"}' \
  -c cookies.txt

# 6. Get tasks (should see same task)
curl -X GET http://localhost:8000/tasks -b cookies.txt

# Verify: Same task from step 2 should be present
```

---

## Success Checklist

After all tests pass:

- [ ] All 6 user stories independently testable
- [ ] All manual test cases (42 total) pass
- [ ] All backend endpoints verified
- [ ] All performance targets met
- [ ] All security checks pass
- [ ] Database integrity verified
- [ ] Responsive design validated (mobile/tablet/desktop)
- [ ] Error handling tested
- [ ] Integration journey complete

---

**Status**: Ready for comprehensive testing
