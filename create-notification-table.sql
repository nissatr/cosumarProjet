-- Script de création de la table notification
-- À exécuter dans votre base de données PostgreSQL

-- Créer la table notification
CREATE TABLE IF NOT EXISTS notification (
    id_notification BIGSERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT NOW(),
    est_lue BOOLEAN NOT NULL DEFAULT FALSE,
    type VARCHAR(50) NOT NULL,
    
    -- Clés étrangères
    id_destinataire BIGINT REFERENCES utilisateur(id_utilisateur) ON DELETE CASCADE,
    id_demande BIGINT REFERENCES demande(id_demande) ON DELETE CASCADE,
    id_service BIGINT REFERENCES service(id_service) ON DELETE CASCADE
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_notification_destinataire ON notification(id_destinataire);
CREATE INDEX IF NOT EXISTS idx_notification_est_lue ON notification(est_lue);
CREATE INDEX IF NOT EXISTS idx_notification_date_creation ON notification(date_creation);
CREATE INDEX IF NOT EXISTS idx_notification_type ON notification(type);

-- Commentaires sur la table
COMMENT ON TABLE notification IS 'Table des notifications système';
COMMENT ON COLUMN notification.id_notification IS 'Identifiant unique de la notification';
COMMENT ON COLUMN notification.titre IS 'Titre de la notification';
COMMENT ON COLUMN notification.message IS 'Message détaillé de la notification';
COMMENT ON COLUMN notification.date_creation IS 'Date et heure de création de la notification';
COMMENT ON COLUMN notification.est_lue IS 'Indique si la notification a été lue';
COMMENT ON COLUMN notification.type IS 'Type de notification (NOUVELLE_DEMANDE, DEMANDE_APPROUVEE, etc.)';
COMMENT ON COLUMN notification.id_destinataire IS 'Utilisateur destinataire de la notification';
COMMENT ON COLUMN notification.id_demande IS 'Demande associée à la notification (optionnel)';
COMMENT ON COLUMN notification.id_service IS 'Service associé à la notification (optionnel)';

-- Afficher la confirmation
SELECT 'Table notification créée avec succès !' as message; 