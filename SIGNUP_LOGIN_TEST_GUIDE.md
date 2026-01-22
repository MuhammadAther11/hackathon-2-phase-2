# Signup & Login Testing Guide - Vercel Deployment

**Live URL**: https://frontend-oa2xco4qe-muhammadather11s-projects.vercel.app
**Date**: 2026-01-22
**Test Status**: Ready for Manual Testing

---

## 🎯 Pre-Test Checklist

Before starting tests, ensure:
- [ ] You have internet connection
- [ ] Browser is up to date (Chrome, Firefox, Safari, Edge)
- [ ] JavaScript is enabled
- [ ] No ad blockers interfering with auth
- [ ] Browser console is open (F12) to check for errors
- [ ] You have a valid email address (can be fake but formatted correctly)

---

## 📝 Test Accounts

Use these test credentials or create your own:

### Test Account 1
```
Email:    testuser001@vercel.test
Password: Vercel@Test123!
Name:     Test User 001
```

### Test Account 2
```
Email:    testuser002@vercel.test
Password: Vercel@Test456!
Name:     Test User 002
```

### Test Account 3
```
Email:    testuser003@vercel.test
Password: Vercel@Test789!
Name:     Test User 003
```

---

## 🧪 TEST 1: SIGNUP FLOW

### Test 1.1: Visit Signup Page
**Objective**: Verify signup page loads correctly

**Steps**:
1. Open browser and navigate to: `https://frontend-oa2xco4qe-muhammadather11s-projects.vercel.app`
2. You should see the landing page with:
   - TaskFlow logo
   - "Manage Your Tasks Effortlessly" heading
   - Login and Sign Up buttons
3. Click the **"Sign Up"** button
4. You should be redirected to: `/signup`

**Expected Results**:
- ✅ Page loads without errors
- ✅ URL shows `/signup`
- ✅ Loading spinner appears briefly
- ✅ Once loaded, you see:
  - "Create Account" heading
  - "Join us to start managing your tasks" subtitle
  - Email input field
  - Password input field
  - Name input field (optional)
  - "Create Account" button
  - "Already have account?" link pointing to `/login`

**Verification**:
- [ ] Page loaded successfully
- [ ] All form fields visible
- [ ] All text readable
- [ ] No console errors (F12)
- [ ] Button is clickable (not disabled)

---

### Test 1.2: Form Validation - Empty Fields
**Objective**: Verify form rejects submission with empty fields

**Steps**:
1. On the signup page, click "Create Account" button **WITHOUT** filling any fields
2. Observe form behavior

**Expected Results**:
- ✅ Form prevents submission
- ✅ Browser's native validation may appear (HTML5)
- ✅ Button stays disabled or shows validation message
- ✅ No API call made

**Verification**:
- [ ] Cannot submit empty form
- [ ] No API request in network tab
- [ ] Form fields remain empty

---

### Test 1.3: Form Validation - Invalid Email
**Objective**: Verify form validates email format

**Steps**:
1. Fill in form with:
   - Email: `invalidemail` (missing @)
   - Password: `Test123!`
   - Name: `Test User`
2. Click "Create Account" button

**Expected Results**:
- ✅ Form prevents submission
- ✅ Error message appears: "Please include an @ in the email address"
- ✅ No API call made

**Verification**:
- [ ] Invalid email rejected
- [ ] Error message displayed
- [ ] No network request

---

### Test 1.4: Complete Signup - Valid Data
**Objective**: Verify successful account creation

**Steps**:
1. Fill in signup form with:
   - Email: `testuser001@vercel.test` (use unique email)
   - Password: `Vercel@Test123!`
   - Name: `Test User 001`
2. Review all fields are filled correctly
3. Click "Create Account" button
4. Wait for response (may take 2-5 seconds)

**Expected Results**:
- ✅ Loading state appears (button shows spinner)
- ✅ API call made to `/api/auth/signup`
- ✅ Response status 200-201
- ✅ Account created successfully
- ✅ Redirected to `/login` page
- ✅ Success message appears: "Account created successfully"

**Verification**:
- [ ] Button shows loading spinner
- [ ] API call in Network tab (status 200+)
- [ ] Redirected to login page
- [ ] Success message visible
- [ ] Can see login form

---

### Test 1.5: Duplicate Signup - Email Already Exists
**Objective**: Verify system prevents duplicate accounts

**Steps**:
1. Try to sign up with the same email as Test 1.4:
   - Email: `testuser001@vercel.test`
   - Password: `Different@Pass123`
   - Name: `Different Name`
2. Click "Create Account" button

**Expected Results**:
- ✅ API call made
- ✅ Response status 400 or 409 (conflict)
- ✅ Error message appears: "Email already registered" or similar
- ✅ Stay on signup page (not redirected)
- ✅ Can retry with different email

**Verification**:
- [ ] Error message displayed
- [ ] Still on signup page
- [ ] Can modify fields and retry

---

### Test 1.6: Signup with Optional Name Omitted
**Objective**: Verify name field is truly optional

**Steps**:
1. Fill in signup form with:
   - Email: `testuser-noname@vercel.test`
   - Password: `Vercel@Test123!`
   - Name: (leave empty/blank)
2. Click "Create Account" button

**Expected Results**:
- ✅ Form accepts submission
- ✅ Account created successfully
- ✅ Redirected to login page
- ✅ Success message appears

**Verification**:
- [ ] Signup accepted without name
- [ ] Account created
- [ ] Redirected to login

---

### Test 1.7: Password Strength
**Objective**: Verify various password formats are accepted

**Steps - Attempt 1**:
1. Email: `testuser-pass1@vercel.test`
2. Password: `test` (weak)
3. Click Create Account

**Steps - Attempt 2**:
1. Email: `testuser-pass2@vercel.test`
2. Password: `Test@123!` (strong)
3. Click Create Account

**Expected Results**:
- ✅ Both passwords accepted (no strength requirement)
- ✅ Or if validation exists, shown clearly

**Verification**:
- [ ] Password validation behavior documented
- [ ] Can proceed with test password

---

## 🔐 TEST 2: LOGIN FLOW

### Test 2.1: Visit Login Page
**Objective**: Verify login page loads correctly

**Steps**:
1. Open browser and navigate to: `https://frontend-oa2xco4qe-muhammadather11s-projects.vercel.app/login`
2. Alternatively, if you're on signup page, click "Already have account?" link

**Expected Results**:
- ✅ Page loads without errors
- ✅ URL shows `/login`
- ✅ Loading spinner appears briefly
- ✅ Once loaded, you see:
  - "Welcome Back" heading
  - "Sign in to access your task dashboard" subtitle
  - Email input field
  - Password input field
  - "Sign In" button
  - "Don't have account?" link pointing to `/signup`

**Verification**:
- [ ] Page loaded successfully
- [ ] All form fields visible
- [ ] All text readable
- [ ] No console errors (F12)
- [ ] Button is clickable

---

### Test 2.2: Form Validation - Empty Fields
**Objective**: Verify form rejects submission with empty fields

**Steps**:
1. On login page, click "Sign In" button **WITHOUT** filling any fields

**Expected Results**:
- ✅ Form prevents submission
- ✅ Browser validation message may appear
- ✅ No API call made

**Verification**:
- [ ] Cannot submit empty form
- [ ] No API request

---

### Test 2.3: Form Validation - Invalid Email Format
**Objective**: Verify email validation on login

**Steps**:
1. Fill in:
   - Email: `notanemail`
   - Password: `SomePassword123`
2. Click "Sign In" button

**Expected Results**:
- ✅ Form prevents submission
- ✅ Browser validation error: "Please include an @ in the email address"

**Verification**:
- [ ] Invalid email rejected
- [ ] No API call

---

### Test 2.4: Login with Non-Existent Account
**Objective**: Verify error handling for non-existent email

**Steps**:
1. Fill in:
   - Email: `nonexistent@vercel.test`
   - Password: `Password@123`
2. Click "Sign In" button
3. Wait for response (2-5 seconds)

**Expected Results**:
- ✅ Loading state appears
- ✅ API call made
- ✅ Response status 401 (Unauthorized)
- ✅ Error message appears: "Invalid email or password" or similar
- ✅ Stay on login page (not redirected)
- ✅ Form fields retained (can see what you entered)

**Verification**:
- [ ] Error message displayed
- [ ] Still on login page
- [ ] Can retry with different credentials

---

### Test 2.5: Login with Wrong Password
**Objective**: Verify incorrect password is rejected

**Steps**:
1. Use valid email from Test 1.4, but wrong password:
   - Email: `testuser001@vercel.test`
   - Password: `WrongPassword123`
2. Click "Sign In" button
3. Wait for response

**Expected Results**:
- ✅ Loading state appears
- ✅ API call made
- ✅ Response status 401
- ✅ Error message: "Invalid email or password"
- ✅ Stay on login page

**Verification**:
- [ ] Wrong password rejected
- [ ] Error message shown
- [ ] Still on login page

---

### Test 2.6: Successful Login
**Objective**: Verify successful authentication

**Steps**:
1. Use credentials from Test 1.4:
   - Email: `testuser001@vercel.test`
   - Password: `Vercel@Test123!`
2. Click "Sign In" button
3. Wait for response and redirect

**Expected Results**:
- ✅ Loading state appears (spinner on button)
- ✅ API call made to `/api/auth/login`
- ✅ Response status 200
- ✅ JWT token received and stored
- ✅ Token stored in localStorage
- ✅ Token synced to cookie
- ✅ **Redirected to `/dashboard`**
- ✅ Success message: "Logged in successfully" or similar

**Verification**:
- [ ] Loading spinner visible
- [ ] API request successful (Network tab)
- [ ] Redirected to dashboard
- [ ] Token visible in localStorage (DevTools)
- [ ] Can see dashboard with task form

**Check Token Storage**:
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Find entry with key containing "auth" or "token"
4. Value should contain JWT (long encoded string)

---

### Test 2.7: Token Persistence
**Objective**: Verify session persists after page refresh

**Steps**:
1. After successful login (Test 2.6), you should be on dashboard
2. Press F5 to refresh the page
3. Wait for page to reload

**Expected Results**:
- ✅ Page reloads
- ✅ You stay on dashboard (not redirected to login)
- ✅ Your tasks remain visible
- ✅ Token still in localStorage
- ✅ Cookie still present

**Verification**:
- [ ] Dashboard loads after refresh
- [ ] Not redirected to login
- [ ] Same content visible
- [ ] Token still in localStorage

---

### Test 2.8: Multiple Sessions - Different Browsers/Tabs
**Objective**: Verify independent sessions for different browsers

**Steps**:
1. Login in Browser Tab 1 with:
   - Email: `testuser001@vercel.test`
2. Open new tab (Tab 2) and go to `/login`
3. Login in Tab 2 with:
   - Email: `testuser002@vercel.test`
4. Check both tabs

**Expected Results**:
- ✅ Both sessions active independently
- ✅ Tab 1 shows User 001's tasks
- ✅ Tab 2 shows User 002's tasks
- ✅ Each has its own JWT token
- ✅ Different cookies for each browser context

**Verification**:
- [ ] Both logins successful
- [ ] Different users' data visible in each tab
- [ ] No cross-contamination

---

## 🔄 TEST 3: COMPLETE USER JOURNEY

### Full Flow Test
**Objective**: Test complete signup → login → dashboard flow

**Steps**:

**Part A: New User Signup**
1. Go to: `https://frontend-oa2xco4qe-muhammadather11s-projects.vercel.app`
2. Click "Sign Up" button
3. Fill form:
   - Email: `journey-test@vercel.test`
   - Password: `Journey@Test123!`
   - Name: `Journey Tester`
4. Click "Create Account"
5. Wait for redirect

**Part B: Confirmation**
- [ ] Redirected to `/login`
- [ ] Success message visible

**Part C: Login with New Account**
1. On login page, fill form:
   - Email: `journey-test@vercel.test`
   - Password: `Journey@Test123!`
2. Click "Sign In"
3. Wait for redirect

**Part D: Dashboard Access**
- [ ] Redirected to `/dashboard`
- [ ] Task creation form visible
- [ ] "Add Task" button present
- [ ] No error messages

**Part E: Task Management**
1. Create a task:
   - Title: "Test from Vercel"
   - Description: (leave empty - test optional feature)
2. Click "Add Task"
3. Verify task appears in list
4. Toggle task completion (click circle icon)
5. Edit task (click pencil icon)
6. Change title to "Updated from Vercel"
7. Click Save
8. Delete task (click trash icon)

**Expected Results**:
- ✅ All steps complete without errors
- ✅ Task operations work correctly
- ✅ UI updates in real-time
- ✅ No console errors

**Verification**:
- [ ] Full flow completed
- [ ] All operations successful
- [ ] No errors encountered

---

## 🔒 TEST 4: SECURITY & ERROR HANDLING

### Test 4.1: XSS Prevention
**Objective**: Verify form escapes malicious input

**Steps**:
1. On signup page, fill:
   - Email: `<script>alert('xss')</script>@test.com`
   - Password: `Test@123`
   - Name: `<img src=x onerror=alert('xss')>`
2. Click "Create Account"

**Expected Results**:
- ✅ Input treated as literal text (not executed)
- ✅ No alert dialogs
- ✅ Form either rejects or sanitizes input
- ✅ No console errors

**Verification**:
- [ ] No XSS attack succeeds
- [ ] Form handles malicious input safely

---

### Test 4.2: Token Expiry Simulation
**Objective**: Verify system handles expired tokens

**Steps**:
1. Login successfully
2. Open DevTools → Application → Local Storage
3. Find auth/token entry
4. Delete or modify the token value
5. Try to perform action (create task)

**Expected Results**:
- ✅ API returns 401 error
- ✅ User redirected to login
- ✅ Message: "Session expired. Please log in again"

**Verification**:
- [ ] 401 error handled gracefully
- [ ] Redirect to login works
- [ ] Error message displayed

---

### Test 4.3: Network Error Handling
**Objective**: Verify graceful handling of network errors

**Steps**:
1. Open DevTools → Network tab
2. Click "Offline" to simulate no network
3. Try to login
4. Check what happens

**Expected Results**:
- ✅ Button shows loading state
- ✅ After timeout, error message: "Connection lost" or similar
- ✅ Can retry once back online
- ✅ No undefined errors in console

**Verification**:
- [ ] Network error handled gracefully
- [ ] User-friendly error message shown
- [ ] Can retry

---

## 📊 TEST RESULTS TEMPLATE

### Summary
- **Date Tested**: ___________
- **Tester**: ___________
- **Browser**: ___________
- **OS**: ___________
- **Network**: ___________

### Results

| Test | Status | Notes |
|------|--------|-------|
| 1.1 - Visit Signup | ✅/⚠️/❌ | |
| 1.2 - Empty Fields | ✅/⚠️/❌ | |
| 1.3 - Invalid Email | ✅/⚠️/❌ | |
| 1.4 - Complete Signup | ✅/⚠️/❌ | |
| 1.5 - Duplicate Signup | ✅/⚠️/❌ | |
| 1.6 - Optional Name | ✅/⚠️/❌ | |
| 1.7 - Password Strength | ✅/⚠️/❌ | |
| 2.1 - Visit Login | ✅/⚠️/❌ | |
| 2.2 - Empty Fields | ✅/⚠️/❌ | |
| 2.3 - Invalid Email | ✅/⚠️/❌ | |
| 2.4 - Non-Existent User | ✅/⚠️/❌ | |
| 2.5 - Wrong Password | ✅/⚠️/❌ | |
| 2.6 - Successful Login | ✅/⚠️/❌ | |
| 2.7 - Token Persistence | ✅/⚠️/❌ | |
| 2.8 - Multiple Sessions | ✅/⚠️/❌ | |
| 3.1 - Full Journey | ✅/⚠️/❌ | |
| 4.1 - XSS Prevention | ✅/⚠️/❌ | |
| 4.2 - Token Expiry | ✅/⚠️/❌ | |
| 4.3 - Network Error | ✅/⚠️/❌ | |

### Issues Found
```
[List any bugs or issues discovered]
```

### Comments
```
[Additional observations or notes]
```

---

## 🐛 Troubleshooting

### Issue: Signup page shows spinner forever
**Solution**:
- Wait 5-10 seconds for auth client to initialize
- If persists, check console for errors (F12)
- Try clearing browser cache
- Try different browser

### Issue: Form submission does nothing
**Solution**:
- Check all required fields are filled
- Open DevTools Network tab to see if API call is made
- Check for console errors (F12)
- Try refreshing page

### Issue: Login fails with "connection lost"
**Solution**:
- Check internet connection
- Verify backend is running and accessible
- Check if API URL is configured correctly in Vercel
- Try again in a few seconds

### Issue: Redirects to login after successful login
**Solution**:
- Backend may be down or unreachable
- Check `NEXT_PUBLIC_API_BASE_URL` in Vercel env vars
- Verify JWT secret matches between frontend and backend
- Check backend CORS configuration

### Issue: Console shows CORS errors
**Solution**:
- Backend CORS not properly configured
- Check backend includes frontend URL in allowed origins
- Check backend allows credentials

---

## ✅ Completion Checklist

Once you've completed all tests, check:

- [ ] All signup tests passed
- [ ] All login tests passed
- [ ] Full journey test passed
- [ ] Security tests passed
- [ ] No critical bugs found
- [ ] Performance acceptable
- [ ] Error messages clear
- [ ] UI responsive
- [ ] No console errors
- [ ] Documentation complete

---

**Testing Guide Created**: 2026-01-22
**For**: Vercel Deployment
**Status**: Ready for Manual Testing

Go to: **https://frontend-oa2xco4qe-muhammadather11s-projects.vercel.app** and start testing!

