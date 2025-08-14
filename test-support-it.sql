-- Script de test pour vérifier les données Support IT
-- À exécuter dans votre base de données pour diagnostiquer le problème

-- 1. Vérifier toutes les demandes
SELECT 
    d.id_demande,
    d.statut,
    d.date_creation,
    u.email as demandeur_email,
    s.nom as service_nom,
    d.urgence
FROM demande d
LEFT JOIN utilisateur u ON d.id_demandeur = u.id_utilisateur
LEFT JOIN service s ON u.id_service = s.id_service
ORDER BY d.date_creation DESC;

-- 2. Vérifier toutes les validations existantes
SELECT 
    v.id_validation,
    v.niveau,
    v.statut_validation,
    v.date_validation,
    v.commentaire,
    d.id_demande,
    u.email as demandeur_email,
    s.nom as service_nom
FROM validation v
JOIN demande d ON v.id_demande = d.id_demande
JOIN utilisateur u ON d.id_demandeur = u.id_utilisateur
LEFT JOIN service s ON u.id_service = s.id_service
ORDER BY v.date_validation DESC;

-- 3. Vérifier les demandes qui devraient être visibles par le Support IT
-- (demandes EN_COURS avec validation Manager N+1 ACCEPTEE)
SELECT DISTINCT
    d.id_demande,
    d.statut,
    d.date_creation,
    u.email as demandeur_email,
    s.nom as service_nom,
    d.urgence,
    v_manager.date_validation as validation_manager_date,
    v_manager.commentaire as validation_manager_commentaire
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

-- 4. Compter les validations par niveau et statut
SELECT 
    niveau,
    statut_validation,
    COUNT(*) as nombre
FROM validation
GROUP BY niveau, statut_validation
ORDER BY niveau, statut_validation;

-- 5. Vérifier les utilisateurs avec leurs rôles et services
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
ORDER BY u.email;
