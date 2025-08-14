#!/bin/bash

# Script de test pour l'API Support IT
echo "🧪 Test de l'API Support IT"

# URL de base
BASE_URL="http://localhost:8089/api/v1.0"

echo "📍 Test de l'endpoint de debug (sans authentification):"
curl -s "$BASE_URL/demandes/debug-support-it" | jq .

echo ""
echo "📍 Test de l'endpoint Support IT (sans authentification):"
curl -s "$BASE_URL/demandes/support-it" | jq .

echo ""
echo "📍 Test de l'endpoint des demandes du service (sans authentification):"
curl -s "$BASE_URL/demandes/mes-demandes-service" | jq .

echo ""
echo "✅ Tests terminés"
echo ""
echo "💡 Pour tester avec authentification, connectez-vous via le frontend et utilisez le bouton Debug"
