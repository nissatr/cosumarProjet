-- Script de test pour vérifier la base de données
-- Connectez-vous à PostgreSQL et exécutez ces commandes

-- 1. Se connecter à la base de données
-- psql -h localhost -U cosumarUser -d cosumarDB

-- 2. Vérifier les tables existantes
\dt

-- 3. Vérifier le contenu de la table demande
SELECT 
    id_demande,
    statut,
    date_creation,
    urgence
FROM demande 
ORDER BY date_creation DESC 
LIMIT 10;

-- 4. Vérifier le contenu de la table validation
SELECT 
    id_validation,
    niveau,
    statut_validation,
    date_validation,
    id_demande,
    id_validateur
FROM validation 
ORDER BY date_validation DESC 
LIMIT 10;

-- 5. Vérifier les utilisateurs et leurs rôles
SELECT 
    u.id_utilisateur,
    u.email,
    u.prenom,
    u.nom,
    r.nom as role_nom,
    s.nom as service_nom
FROM utilisateur u
LEFT JOIN role r ON u.id_role = r.id_role
LEFT JOIN service s ON u.id_service = s.id_service
ORDER BY u.email
LIMIT 10;

-- 6. Compter les demandes par statut
SELECT 
    statut,
    COUNT(*) as nombre
FROM demande
GROUP BY statut
ORDER BY statut;

-- 7. Compter les validations par niveau et statut
SELECT 
    niveau,
    statut_validation,
    COUNT(*) as nombre
FROM validation
GROUP BY niveau, statut_validation
ORDER BY niveau, statut_validation;

-- 8. Vérifier les demandes qui devraient être visibles par le Support IT
SELECT DISTINCT
    d.id_demande,
    d.statut,
    d.date_creation,
    d.urgence,
    u.email as demandeur_email,
    s.nom as service_nom,
    v_manager.date_validation as validation_manager_date
FROM demande d
JOIN utilisateur u ON d.id_demandeur = u.id_utilisateur
LEFT JOIN service s ON u.id_service = s.id_service
JOIN validation v_manager ON d.id_demande = v_manager.id_demande
WHERE d.statut = 'EN_COURS'
AND v_manager.niveau = 'Manager N+1'
AND v_manager.statut_validation = 'ACCEPTEE'
AND NOT EXISTS (
    SELECT 1 FROM validation v_support 
    WHERE v_support.id_demande = d.id_demande 
    AND v_support.niveau = 'Support IT'
)
ORDER BY d.urgence DESC, d.date_creation ASC;
