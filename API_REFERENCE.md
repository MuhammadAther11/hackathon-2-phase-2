# API Reference: 004-auth-persistence-ui

Quick reference for all 8 API endpoints. Base URL: `http://localhost:8000`

---

## Authentication Endpoints

### POST /auth/signup
Register a new user and receive JWT token.

**Request**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation**
- `email`: Valid email format (RFC 5322)
- `password`: Minimum 8 characters

**Response (201 Created)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "created_at": "2026-01-12T10:30:00Z"
}
```
**Set-Cookie**: `auth_token=<jwt_token>; HttpOnly; SameSite=Strict; Path=/`

**Errors**
- `409 Conflict`: Email already registered
- `422 Unprocessable Entity`: Invalid email or short password

---

### POST /auth/login
Authenticate existing user and receive JWT token.

**Request**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "created_at": "2026-01-12T10:30:00Z"
}
```
**Set-Cookie**: `auth_token=<jwt_token>; HttpOnly; SameSite=Strict; Path=/`

**Errors**
- `401 Unauthorized`: Invalid email or password (don't differentiate for security)

---

### POST /auth/logout
Clear JWT session.

**Headers**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK)**
```json
{
  "message": "Logged out successfully"
}
```
**Set-Cookie**: `auth_token=; Max-Age=0` (clears cookie)

**Errors**
- `401 Unauthorized`: Invalid or missing JWT

---

## Task Endpoints

All task endpoints require JWT authentication.

```
Authorization: Bearer <jwt_token>
```

---

### GET /tasks
Retrieve all tasks for authenticated user.

**Response (200 OK)**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Buy groceries",
    "completed": false,
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "created_at": "2026-01-12T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "title": "Complete project",
    "completed": true,
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "created_at": "2026-01-12T11:00:00Z"
  }
]
```

**Errors**
- `401 Unauthorized`: Missing or invalid JWT
- `500 Internal Server Error`: Database error

---

### POST /tasks
Create new task for authenticated user.

**Request**
```json
{
  "title": "Buy groceries"
}
```

**Validation**
- `title`: Non-empty string, max 255 characters

**Response (201 Created)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "completed": false,
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "created_at": "2026-01-12T10:30:00Z"
}
```

**Errors**
- `401 Unauthorized`: Missing or invalid JWT
- `422 Unprocessable Entity`: Empty title or validation error

---

### PUT /tasks/{task_id}
Update existing task (title or completion status).

**Parameters**
- `task_id`: UUID of task to update (path parameter)

**Request** (optional fields)
```json
{
  "title": "Updated title",
  "completed": true
}
```

**Response (200 OK)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated title",
  "completed": true,
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "created_at": "2026-01-12T10:30:00Z"
}
```

**Errors**
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: User doesn't own this task
- `404 Not Found`: Task doesn't exist
- `422 Unprocessable Entity`: Validation error

---

### DELETE /tasks/{task_id}
Delete existing task.

**Parameters**
- `task_id`: UUID of task to delete (path parameter)

**Response (204 No Content)**
```
(empty body)
```

**Errors**
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: User doesn't own this task
- `404 Not Found`: Task doesn't exist

---

### PATCH /tasks/{task_id}/toggle
Toggle task completion status.

**Parameters**
- `task_id`: UUID of task to toggle (path parameter)

**Request**
```
(empty body)
```

**Response (200 OK)**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Buy groceries",
  "completed": true,
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "created_at": "2026-01-12T10:30:00Z"
}
```

**Errors**
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: User doesn't own this task
- `404 Not Found`: Task doesn't exist

---

## Error Responses

### 401 Unauthorized
Missing or invalid JWT token.

```json
{
  "detail": "Invalid or expired token"
}
```

**When**:
- No Authorization header
- Invalid JWT signature
- Expired token
- Missing user_id in token

---

### 403 Forbidden
User doesn't have permission to access resource.

```json
{
  "detail": "You do not have permission to access this resource"
}
```

**When**:
- Trying to access/modify another user's task
- Cross-user unauthorized action

---

### 404 Not Found
Resource doesn't exist.

```json
{
  "detail": "Task not found"
}
```

**When**:
- Task ID doesn't exist
- Task was already deleted

---

### 409 Conflict
Resource already exists (duplicate).

```json
{
  "detail": "Email already registered"
}
```

**When**:
- Signup with existing email

---

### 422 Unprocessable Entity
Validation error in request.

```json
{
  "detail": [
    {
      "type": "value_error.email",
      "loc": ["body", "email"],
      "msg": "invalid email format"
    },
    {
      "type": "value_error.string.too_short",
      "loc": ["body", "password"],
      "msg": "ensure this value has at least 8 characters"
    }
  ]
}
```

**When**:
- Invalid email format
- Password too short
- Empty task title
- Invalid data types

---

### 500 Internal Server Error
Unexpected server error.

```json
{
  "detail": "Internal server error"
}
```

**When**:
- Database connection failure
- Unexpected exception
- Unhandled error

---

## Example Workflows

### Complete Signup → Create Task → Logout Flow

```bash
# 1. Signup
curl -X POST http://localhost:8000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# Response: 201 Created + Set-Cookie header
# Cookie stored in cookies.txt

# 2. Create task
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk"}' \
  -b cookies.txt

# Response: 201 Created
# JWT automatically sent via cookies.txt

# 3. Get tasks
curl -X GET http://localhost:8000/tasks \
  -b cookies.txt

# Response: 200 OK with task list

# 4. Logout
curl -X POST http://localhost:8000/auth/logout \
  -b cookies.txt

# Response: 200 OK
# Cookie cleared
```

### Login → Get Tasks Flow

```bash
# 1. Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# Response: 200 OK + Set-Cookie header

# 2. Get tasks
curl -X GET http://localhost:8000/tasks \
  -b cookies.txt

# Response: 200 OK with task list
```

---

## Frontend Integration

### With centralized API client

```typescript
// src/lib/api-client.ts automatically handles:
// - Adding Authorization header
// - Including cookies
// - Handling 401 errors (redirect to login)

import { apiFetch } from '@/lib/api-client'

// Signup
const user = await apiFetch('/auth/signup', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
}).then(r => r.json())

// Get tasks (JWT automatically attached)
const tasks = await apiFetch('/tasks').then(r => r.json())

// Create task
const newTask = await apiFetch('/tasks', {
  method: 'POST',
  body: JSON.stringify({ title }),
}).then(r => r.json())
```

---

## Performance Targets

- Signup: <2 seconds
- Login: <2 seconds
- Get tasks: <1 second
- Create task: <1 second
- Update task: <500ms
- Delete task: <500ms

---

## Status Codes Summary

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | GET successful, login successful |
| 201 | Created | POST successful (signup, create task) |
| 204 | No Content | DELETE successful |
| 400 | Bad Request | Malformed request |
| 401 | Unauthorized | Missing/invalid JWT |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Validation error |
| 500 | Server Error | Database or system error |

---

**Version**: 1.0
**Last Updated**: 2026-01-12
**Status**: ACTIVE - Ready for testing
