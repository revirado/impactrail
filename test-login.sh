#!/bin/bash

echo "=== Testing Impactrail Login Flow ==="
echo ""

echo "1. Testing health endpoint..."
HEALTH=$(curl -s http://localhost:3000/api/health)
echo "$HEALTH" | python3 -m json.tool
echo ""

echo "2. Testing login endpoint..."
LOGIN=$(curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techcorp.com"}')
echo "$LOGIN" | python3 -m json.tool
echo ""

echo "3. Testing login page..."
PAGE=$(curl -s http://localhost:3000/login)
if echo "$PAGE" | grep -q "Impactrail"; then
  echo "✓ Login page loads correctly"
else
  echo "✗ Login page failed to load"
fi
echo ""

echo "4. Testing middleware redirect..."
REDIRECT=$(curl -s -I http://localhost:3000/ | grep -i location)
if echo "$REDIRECT" | grep -q "/login"; then
  echo "✓ Middleware redirects to /login when not authenticated"
else
  echo "✗ Middleware redirect failed"
fi
echo ""

echo "=== Test Complete ==="
