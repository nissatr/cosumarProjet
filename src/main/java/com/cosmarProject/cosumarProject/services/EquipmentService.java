package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.io.EquipmentRequest;
import com.cosmarProject.cosumarProject.model.*;
import com.cosmarProject.cosumarProject.repository.DemandeRepository;
import com.cosmarProject.cosumarProject.repository.TypeDemandeRepository;
import com.cosmarProject.cosumarProject.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final DemandeRepository demandeRepository;
    private final TypeDemandeRepository typeDemandeRepository;
    private final UtilisateurRepository utilisateurRepository;

    /**
     * Créer une nouvelle demande d'équipement
     */
    // Dans EquipmentService
    public Demande createEquipmentRequest(EquipmentRequest request, String userEmail) {
        System.out.println("🔄 Création de demande d'équipement");
        System.out.println("📝 EquipmentType reçu: " + request.getEquipmentType());
        System.out.println("📝 RequestType reçu: " + request.getRequestType());
        
        Utilisateur demandeur = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Conversion requestType -> DetailType
        final TypeDemande.DetailType finalDetailType;
        if (request.getRequestType() == null || request.getRequestType().isEmpty()) {
            finalDetailType = null;
        } else if ("nouveau".equalsIgnoreCase(request.getRequestType())) {
            finalDetailType = TypeDemande.DetailType.NOUVEAU;
        } else if ("changement".equalsIgnoreCase(request.getRequestType())) {
            finalDetailType = TypeDemande.DetailType.CHANGEMENT;
        } else {
            finalDetailType = null;
        }
        
        System.out.println("🔍 DetailType converti: " + finalDetailType);


        // Afficher tous les types disponibles pour debug
        System.out.println("🔍 Recherche du type: " + request.getEquipmentType() + " avec DetailType: " + finalDetailType);
        System.out.println("📋 Types disponibles dans la base:");
        typeDemandeRepository.findAll().forEach(type -> 
            System.out.println("  - " + type.getNomType() + " (DetailType: " + type.getDetailType() + ", aDetailType: " + type.getADetailType() + ")")
        );
        
        TypeDemande typeDemande = typeDemandeRepository
                .findByNomTypeAndDetailType(request.getEquipmentType(), finalDetailType)
                .orElseThrow(() -> new RuntimeException(
                    "Type de demande non trouvé: " + request.getEquipmentType() +
                    " (" + (finalDetailType != null ? finalDetailType.toString() : "N/A") + ")"
                ));
        
        System.out.println("✅ Type trouvé: " + typeDemande.getNomType() + " (ID: " + typeDemande.getId_Type() + ")");


        // ⚡ Convertir la chaîne urgencyLevel en enum
        UrgenceDemande urgence;
        switch (request.getUrgencyLevel().toLowerCase()) {
            case "faible": urgence = UrgenceDemande.FAIBLE; break;
            case "normale": urgence = UrgenceDemande.NORMALE; break;
            case "elevee": urgence = UrgenceDemande.ELEVEE; break;
            default: urgence = UrgenceDemande.FAIBLE; // valeur par défaut
        }

        // Créer la demande
        Demande demande = Demande.builder()
                .dateCreation(LocalDateTime.now())
                .description(request.getDescription())
                .demandeur(demandeur)
                .typeDemande(typeDemande)
                .statut(StatutDemande.EN_COURS)   // ⚡ Statut par défaut
                .urgence(urgence)                 // ⚡ Niveau d'urgence
                .commentaireAutres(request.getEquipmentType() +
                        (request.getRequestType() != null ? " - " + request.getRequestType() : ""))
                .build();

        return demandeRepository.save(demande);
    }


    /**
     * Récupérer toutes les demandes d'un utilisateur
     */
    public List<Demande> getUserRequests(String userEmail) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return demandeRepository.findByDemandeur(utilisateur);
    }

    /**
     * Récupérer les statistiques du dashboard
     */
    public DashboardStats getDashboardStats(String userEmail) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        List<Demande> userDemandes = demandeRepository.findByDemandeur(utilisateur);

        final long total = userDemandes.size();
        final long enCours = userDemandes.stream()
                .filter(d -> d.getStatut() == StatutDemande.EN_COURS)
                .count();
        final long acceptees = userDemandes.stream()
                .filter(d -> d.getStatut() == StatutDemande.ACCEPTEE)
                .count();
        final long refusees = userDemandes.stream()
                .filter(d -> d.getStatut() == StatutDemande.REFUSEE)
                .count();
        final long urgentes = userDemandes.stream()
                .filter(d -> d.getUrgence() == UrgenceDemande.ELEVEE)
                .count();

        return DashboardStats.builder()
                .totalDemandes(total)
                .enCours(enCours)
                .acceptees(acceptees)
                .refusees(refusees)
                .urgentes(urgentes)
                .build();
    }


    /**
     * Classe interne pour les statistiques du dashboard
     */
    public static class DashboardStats {
        private long totalDemandes;
        private long enCours;
        private long acceptees;
        private long refusees;
        private long urgentes;

        // Constructeurs, getters, setters
        public DashboardStats() {}

        public DashboardStats(long totalDemandes, long enCours, long acceptees, long refusees, long urgentes) {
            this.totalDemandes = totalDemandes;
            this.enCours = enCours;
            this.acceptees = acceptees;
            this.refusees = refusees;
            this.urgentes = urgentes;
        }

        // Getters
        public long getTotalDemandes() { return totalDemandes; }
        public long getEnCours() { return enCours; }
        public long getAcceptees() { return acceptees; }
        public long getRefusees() { return refusees; }
        public long getUrgentes() { return urgentes; }

        // Setters
        public void setTotalDemandes(long totalDemandes) { this.totalDemandes = totalDemandes; }
        public void setEnCours(long enCours) { this.enCours = enCours; }
        public void setAcceptees(long acceptees) { this.acceptees = acceptees; }
        public void setRefusees(long refusees) { this.refusees = refusees; }
        public void setUrgentes(long urgentes) { this.urgentes = urgentes; }

        // Builder pattern
        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private long totalDemandes;
            private long enCours;
            private long acceptees;
            private long refusees;
            private long urgentes;

            public Builder totalDemandes(long totalDemandes) {
                this.totalDemandes = totalDemandes;
                return this;
            }

            public Builder enCours(long enCours) {
                this.enCours = enCours;
                return this;
            }

            public Builder acceptees(long acceptees) {
                this.acceptees = acceptees;
                return this;
            }

            public Builder refusees(long refusees) {
                this.refusees = refusees;
                return this;
            }

            public Builder urgentes(long urgentes) {
                this.urgentes = urgentes;
                return this;
            }

            public DashboardStats build() {
                return new DashboardStats(totalDemandes, enCours, acceptees, refusees, urgentes);
            }
        }
    }
}
