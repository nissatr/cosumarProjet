#!/bin/bash

echo "🧪 Test de l'endpoint SI"
echo "=========================="

# Test de l'endpoint SI
echo "📡 Test GET /demandes/si"
echo "🔍 Vérification de l'endpoint..."

# Test sans authentification (devrait donner 403 ou 401)
echo "📊 Test sans authentification:"
curl -X GET "http://localhost:8089/api/v1.0/demandes/si" \
  -H "Content-Type: application/json" \
  -v

echo ""
echo ""

# Test avec authentification (si vous avez un token)
echo "📊 Test avec authentification (si vous avez un token):"
echo "⚠️  Remplacez YOUR_SESSION_ID par votre vrai session ID"

# curl -X GET "http://localhost:8089/api/v1.0/demandes/si" \
#   -H "Content-Type: application/json" \
#   -H "Cookie: JSESSIONID=YOUR_SESSION_ID" \
#   -v

echo ""
echo "✅ Test terminé"
echo ""
echo "🔍 Vérifiez aussi les logs du backend pour voir si l'endpoint est appelé"
