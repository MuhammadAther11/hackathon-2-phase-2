# Task Management Application - Phase 2

A modern, full-stack task management application with secure authentication and real-time synchronization.

## 🚀 Live Deployment

### Production Links
- **Frontend**: https://hackathon-2-phase-2-sigma.vercel.app/
- **Backend API**: https://atherali11-p2-full-stack-todo-app.hf.space
- **GitHub Repository**: https://github.com/MuhammadAther11/hackathon-2-phase-2
- **Youtube Video link**: https://youtu.be/6UBAuuK0OgA


### Quick Access
| Page | URL |
|------|-----|
| Landing |https://hackathon-2-phase-2-sigma.vercel.app/|
| Signup | https://hackathon-2-phase-2-sigma.vercel.app/signup |
| Login | https://hackathon-2-phase-2-sigma.vercel.app/login |
| API Docs | https://atherali11-p2-full-stack-todo-app.hf.space |

---

## 📋 Project Overview

This is a complete task management system built with modern web technologies. Users can create, read, update, and delete tasks with full authentication and multi-user support.

### Key Features
- ✅ User authentication (signup/login)
- ✅ Create tasks with optional descriptions
- ✅ Edit existing tasks inline
- ✅ Toggle task completion status
- ✅ Delete tasks
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Secure JWT-based authentication
- ✅ Real-time state synchronization
- ✅ Professional UI with animations

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Better Auth
- **Deployment**: Vercel

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: SQLModel
- **Authentication**: JWT (Better Auth)
- **Deployment**: Hugging Face Spaces

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- PostgreSQL connection string (for database)

### Frontend Setup

1. **Clone and install**:
```bash
git clone https://github.com/MuhammadAther11/hackathon-2-phase-2.git
cd phase-2/frontend
npm install
```

2. **Configure environment**:
```bash
# Copy example to local config
cp .env.example .env.local

# Update with your backend URL
# NEXT_PUBLIC_API_BASE_URL=https://hackathon-2-phase-2-sigma.vercel.app/
```

3. **Run development server**:
```bash
npm run dev
# Opens at http://localhost:3000
```

4. **Build for production**:
```bash
npm run build
npm start
```

### Backend Setup

1. **Install dependencies**:
```bash
cd phase-2/backend
pip install -r requirements.txt
```

2. **Configure environment**:
```bash
# Create .env file
cp .env.example .env

# Update with your configuration:
# DATABASE_URL=postgresql://user:password@host/dbname
# BETTER_AUTH_SECRET=your-jwt-secret
# BETTER_AUTH_URL=https://atherali11-p2-full-stack-todo-app.hf.space
```

3. **Run development server**:
```bash
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
# Opens at http://localhost:8000
# API docs at http://localhost:8000/docs
```

---

## 📖 API Documentation

### Base URL
```
https://atherali11-p2-full-stack-todo-app.hf.space
```

### Authentication Endpoints

#### Signup
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "User Name"
}

Response: 201 Created
{
  "user": { "id": "...", "email": "...", "name": "..." },
  "token": "eyJhbGc..."
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response: 200 OK
{
  "user": { "id": "...", "email": "..." },
  "token": "eyJhbGc..."
}
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/{user_id}/tasks
Authorization: Bearer {jwt_token}

Response: 200 OK
[
  {
    "id": "...",
    "title": "Task 1",
    "description": "Description",
    "is_completed": false,
    "created_at": "2026-01-22T..."
  }
]
```

#### Create Task
```http
POST /api/{user_id}/tasks
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "New Task",
  "description": "Optional description"
}

Response: 201 Created
```

#### Update Task
```http
PUT /api/{user_id}/tasks/{task_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "is_completed": true
}

Response: 200 OK
```

#### Toggle Task Completion
```http
PATCH /api/{user_id}/tasks/{task_id}/complete
Authorization: Bearer {jwt_token}

Response: 200 OK
```

#### Delete Task
```http
DELETE /api/{user_id}/tasks/{task_id}
Authorization: Bearer {jwt_token}

Response: 204 No Content
```

### Interactive API Docs
Visit: https://atherali11-p2-full-stack-todo-app.hf.space
---

## 🧪 Testing

### Manual Testing
A comprehensive testing guide is available in `SIGNUP_LOGIN_TEST_GUIDE.md`:
- Signup flow testing (7 tests)
- Login flow testing (8 tests)
- Complete user journey
- Security testing
- Performance testing

### Test Results
See `VERCEL_TEST_RESULTS.md` for complete test results:
- ✅ 30/30 tests passed (100%)
- ✅ All features verified working
- ✅ Production ready status confirmed

### Run Locally
```bash
# Terminal 1: Backend
cd backend
python -m uvicorn src.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Visit: http://localhost:3000
```

---

## 📁 Project Structure

```
phase-2/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # Next.js App Router pages
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility libraries
│   │   └── types/           # TypeScript types
│   ├── .env.example         # Environment template
│   └── package.json         # Dependencies
│
├── backend/                  # FastAPI application
│   ├── src/
│   │   ├── api/             # API routes
│   │   ├── models/          # SQLModel definitions
│   │   ├── middleware/      # Auth middleware
│   │   ├── services/        # Business logic
│   │   └── main.py          # App entry point
│   ├── .env.example         # Environment template
│   └── requirements.txt     # Python dependencies
│
├── FIXES_SUMMARY.md         # Bug fixes documentation
├── DEPLOYMENT_REPORT.md     # Deployment details
├── SIGNUP_LOGIN_TEST_GUIDE.md # Testing guide
├── VERCEL_TEST_RESULTS.md   # Test results
└── README.md                # This file
```

---

## 🔒 Security

### Features
- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ HTTPS enforced
- ✅ CORS properly configured
- ✅ Input validation (client & server)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Secure cookie handling

### Best Practices
- Never commit `.env` files with secrets
- Rotate JWT secrets regularly
- Use strong passwords (minimum 8 characters)
- Enable HTTPS in production
- Monitor API logs for suspicious activity

---

## 🚀 Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel and automatically redeploys on git push.

**URL**: https://hackathon-2-phase-2-sigma.vercel.app/

**Environment Variables** (set in Vercel dashboard):
```
NEXT_PUBLIC_API_BASE_URL=https://atherali11-p2-full-stack-todo-app.hf.space
BETTER_AUTH_SECRET=[your-jwt-secret]
BETTER_AUTH_URL=https://hackathon-2-phase-2-sigma.vercel.app/
```

### Backend (Hugging Face Spaces)
The backend is deployed on HF Spaces with continuous deployment.

**URL**: https://atherali11-p2-full-stack-todo-app.hf.space
**Environment Variables**:
```
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=[your-jwt-secret]
BETTER_AUTH_URL=https://hackathon-2-phase-2-sigma.vercel.app/
```

---

## 🐛 Bug Fixes

### Recent Fixes (Phase 2)
1. ✅ **Task Toggle Endpoint**: Fixed path from `/toggle` to `/complete`
2. ✅ **Task Description**: Now optional (was required)
3. ✅ **Task Editing**: Added inline edit feature
4. ✅ **API Routing**: Fixed URL construction issues

See `FIXES_SUMMARY.md` for detailed information.

---

## 📊 Recent Updates

### Latest Commits
- `c4dd8fb` - Add comprehensive Vercel deployment test results
- `98763ed` - Add comprehensive signup and login testing guide
- `edebcba` - Add Vercel deployment report
- `fd006ed` - Add comprehensive fixes summary documentation
- `12f01da` - Fix task update failures and add edit feature

---

## 🤝 Contributing

This is a hackathon project. To contribute:

1. Clone the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add your feature"`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

---

## 📝 Environment Variables

### Frontend (.env.local)
```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=https://atherali11-p2-full-stack-todo-app.hf.space
# Better Auth Configuration
BETTER_AUTH_SECRET=[your-jwt-secret]
BETTER_AUTH_URL=https://hackathon-2-phase-2-sigma.vercel.app/
```

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT Secret
BETTER_AUTH_SECRET=[your-jwt-secret]

# Frontend URL (for CORS)
BETTER_AUTH_URL=https://hackathon-2-phase-2-sigma.vercel.app/

# Optional: Debug mode
DEBUG=false
```

---

## 🆘 Troubleshooting

### Frontend won't connect to backend
- Verify `NEXT_PUBLIC_API_BASE_URL` is set correctly
- Check backend is running and accessible
- Verify CORS headers from backend
- Check browser console for errors (F12)

### Login fails
- Verify backend database is connected
- Check JWT secret matches between frontend and backend
- Ensure user account exists (try signup first)
- Check backend logs for errors

### Tasks not loading on dashboard
- Ensure you're authenticated (token in localStorage)
- Verify backend API is responding
- Check network requests in DevTools (F12)
- Look for 401/403 errors (authentication issues)

### Build errors on Vercel
- Check environment variables are set
- Run `npm run build` locally to test
- Check Node.js version compatibility
- Review Vercel build logs for details

---

## 📚 Documentation

Additional documentation files:
- **FIXES_SUMMARY.md** - Detailed bug fixes and changes
- **DEPLOYMENT_REPORT.md** - Vercel deployment information
- **SIGNUP_LOGIN_TEST_GUIDE.md** - Complete testing guide (30 tests)
- **VERCEL_TEST_RESULTS.md** - Test results and findings

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check browser console for errors (F12)
4. Review API documentation at `/docs` endpoint

---

## 📄 License

This is a hackathon project. All rights reserved.

---

## ✅ Project Status

- ✅ Frontend deployed on Vercel
- ✅ Backend deployed on HF Spaces
- ✅ All features working
- ✅ All tests passing (30/30)
- ✅ Security verified
- ✅ Production ready

**Last Updated**: 2026-01-22
**Status**: 🟢 LIVE & OPERATIONAL

---

## 🎯 Quick Start

1. **Visit the app**: https://hackathon-2-phase-2-sigma.vercel.app/
2. **Sign up** with your email
3. **Create tasks** with descriptions (optional!)
4. **Manage tasks**: Edit, toggle completion, or delete
5. **Log out** when done

Enjoy task management! 🚀

