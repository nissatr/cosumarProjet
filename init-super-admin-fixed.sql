-- Script d'initialisation du Super Admin (CORRIGÉ)
-- À exécuter dans votre base de données PostgreSQL

-- 1. Créer le rôle SUPER_ADMIN (si pas déjà existant)
INSERT INTO role (nom) 
VALUES ('SUPER_ADMIN') 
ON CONFLICT (nom) DO NOTHING;

-- 2. Créer le service Informatique (si pas déjà existant)
INSERT INTO service (nom) 
VALUES ('Informatique') 
ON CONFLICT (nom) DO NOTHING;

-- 3. Créer l'utilisateur Super Admin (si pas déjà existant)
-- Note: On ne spécifie PAS id_utilisateur pour laisser l'auto-incrémentation faire son travail
INSERT INTO utilisateur (
    nom, 
    prenom, 
    email, 
    mot_de_passe, 
    telephone, 
    est_actif, 
    is_account_verified, 
    user_id, 
    id_role, 
    id_service,
    date_creation
) 
SELECT 
    'Super',
    'Admin',
    'admin@cosumar.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- mot de passe: "password"
    '0000000000',
    true,
    true,
    'super-admin-' || gen_random_uuid(),
    r.id_role,
    s.id_service,
    NOW()
FROM role r, service s
WHERE r.nom = 'SUPER_ADMIN' 
  AND s.nom = 'Informatique'
  AND NOT EXISTS (
    SELECT 1 FROM utilisateur u 
    WHERE u.email = 'admin@cosumar.com'
  );

-- 4. Afficher le résultat
SELECT 
    'Super Admin créé avec succès !' as message,
    u.id_utilisateur,
    u.email,
    u.nom || ' ' || u.prenom as nom_complet,
    r.nom as role,
    s.nom as service,
    u.est_actif,
    u.is_account_verified
FROM utilisateur u
JOIN role r ON u.id_role = r.id_role
JOIN service s ON u.id_service = s.id_service
WHERE u.email = 'admin@cosumar.com';
