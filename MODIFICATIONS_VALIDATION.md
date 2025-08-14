# Modifications pour le processus de validation

## Contexte
Simplification du processus de validation des demandes pour les managers N+1 :
- Suppression de la vérification de rôle côté backend
- Filtrage uniquement par service de l'utilisateur connecté et statut EN_COURS
- Seuls les managers N+1 voient le bouton "Validation" dans le sidebar

## Modifications apportées

### Backend (DemandeController.java)

#### Nouvel endpoint ajouté
```java
@GetMapping("/demandes/mes-demandes-service")
public ResponseEntity<?> getDemandesPourMonService(Authentication authentication)
```

**Fonctionnalités :**
- Récupère l'utilisateur connecté via son email dans l'authentification
- Récupère son service associé
- Filtre toutes les demandes EN_COURS du même service
- **Aucune vérification de rôle** - seuls les managers N+1 voient le bouton côté frontend

**Logique de filtrage :**
```java
List<Demande> demandes = demandeRepository.findAll().stream()
    .filter(d -> d.getService() != null && 
                d.getService().getId_service().equals(serviceUtilisateur.getId_service()) &&
                d.getStatut() == StatutDemande.EN_COURS)
    .collect(Collectors.toList());
```

### Frontend (Validation.jsx)

#### Endpoint modifié
- **Avant :** `http://localhost:8089/demandes/manager/demandes` (vérifiait le rôle)
- **Après :** `http://localhost:8089/demandes/mes-demandes-service` (filtre par service)

### Sidebar (Sidebar.jsx)
- L'onglet "Validation" reste visible uniquement pour les utilisateurs avec le rôle "Manager N+1"
- La logique de détection du rôle reste côté frontend

## Processus simplifié

1. **Manager N+1 se connecte** → bouton "Validation" visible dans le sidebar
2. **Clique sur "Validation"** → frontend envoie requête GET à `/demandes/mes-demandes-service`
3. **Backend récupère :**
   - L'utilisateur connecté (via son email dans Authentication)
   - Son service
   - Toutes les demandes EN_COURS du même service
4. **Backend renvoie** ces demandes au frontend
5. **Frontend affiche** ces demandes dans un tableau avec les actions Approuver et Refuser

## Avantages

- **Sécurité :** Seuls les managers N+1 voient le bouton (contrôle côté frontend)
- **Performance :** Pas de vérification de rôle côté backend
- **Simplicité :** Filtrage direct par service et statut
- **Maintenabilité :** Code plus simple et direct

## Endpoints existants conservés

- `/demandes/{id}/approve` - Approuver une demande
- `/demandes/{id}/reject` - Refuser une demande
- `/demandes/manager/demandes` - Ancien endpoint (peut être supprimé si plus utilisé)

## Test

1. Démarrer le backend : `mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=8089"`
2. Démarrer le frontend : `cd frontend && npm run dev`
3. Se connecter avec un compte manager N+1
4. Vérifier que l'onglet "Validation" est visible
5. Cliquer sur "Validation" et vérifier que les demandes EN_COURS du même service s'affichent 