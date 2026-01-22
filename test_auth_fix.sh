#!/bin/bash
# Test script to verify the authentication fix after backend redeployment

echo "Waiting for backend to be redeployed with the authentication fix..."
echo "This script assumes the backend has been redeployed with bcrypt instead of argon2"

# Wait a bit for the redeployment to complete
sleep 10

echo "Testing authentication fix..."

# Step 1: Create a test user
echo "Step 1: Creating test user..."
SIGNUP_RESPONSE=$(curl -s -X POST "https://atherali11-deploy-phase-2.hf.space/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"authtest@example.com","password":"Authtest123!"}' \
  -w "\n%{http_code}" \
  -o signup_result.tmp)

HTTP_CODE=$(tail -n1 signup_result.tmp)
SIGNUP_DATA=$(head -n -1 signup_result.tmp)

echo "Signup HTTP Code: $HTTP_CODE"
echo "Signup Response: $SIGNUP_DATA"

if [ "$HTTP_CODE" != "201" ]; then
    echo "ERROR: Signup failed with HTTP code $HTTP_CODE"
    exit 1
else
    echo "SUCCESS: Signup worked!"
fi

# Step 2: Try to login with the created user
echo "Step 2: Attempting login with created user..."
LOGIN_RESPONSE=$(curl -s -X POST "https://atherali11-deploy-phase-2.hf.space/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"authtest@example.com","password":"Authtest123!"}' \
  -w "\n%{http_code}" \
  -o login_result.tmp)

LOGIN_HTTP_CODE=$(tail -n1 login_result.tmp)
LOGIN_DATA=$(head -n -1 login_result.tmp)

echo "Login HTTP Code: $LOGIN_HTTP_CODE"
echo "Login Response: $LOGIN_DATA"

if [ "$LOGIN_HTTP_CODE" != "200" ]; then
    echo "ERROR: Login failed with HTTP code $LOGIN_HTTP_CODE"
    echo "The authentication fix may not be deployed yet or there may be other issues"
    exit 1
else
    echo "SUCCESS: Login worked! Authentication fix is working!"
    ACCESS_TOKEN=$(echo $LOGIN_DATA | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])" 2>/dev/null || echo "")
    if [ ! -z "$ACCESS_TOKEN" ]; then
        echo "Received access token, authentication is fully functional"
    fi
fi

# Clean up temporary files
rm -f signup_result.tmp login_result.tmp

echo ""
echo "Authentication fix verification completed successfully!"
echo "Both signup and login are working as expected."