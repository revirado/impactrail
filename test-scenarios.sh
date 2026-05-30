#!/bin/bash

echo "========================================"
echo "  Impactrail - Test de Escenarios"
echo "========================================"
echo ""

echo "=== Escenario 1: Server UP + DB UP ==="
echo "Estado esperado: status=ok, database=connected"
curl -s http://localhost:3000/api/health | python3 -m json.tool
echo ""
curl -s http://localhost:3000/api/health/db | python3 -m json.tool
echo ""

echo "=== Escenario 2: Login funcional ==="
echo "Estado esperado: success=true, user data"
curl -s -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techcorp.com"}' | python3 -m json.tool | head -10
echo ""

echo "=== Escenario 3: Login page carga correctamente ==="
echo "Estado esperado: HTTP 200, contiene 'Impactrail'"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/login)
echo "HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
  echo "✓ Login page carga correctamente"
else
  echo "✗ Login page no carga"
fi
echo ""

echo "=== Escenario 4: Middleware protege rutas ==="
echo "Estado esperado: 307 redirect a /login"
REDIRECT=$(curl -s -I http://localhost:3000/corporate 2>/dev/null | grep -i location | tr -d '\r')
echo "$REDIRECT"
if echo "$REDIRECT" | grep -q "/login"; then
  echo "✓ Middleware redirige correctamente"
else
  echo "✗ Middleware no redirige"
fi
echo ""

echo "========================================"
echo "  Tests Completados"
echo "========================================"
