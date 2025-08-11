package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.io.EquipmentRequest;
import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.model.TypeDemande;
import com.cosmarProject.cosumarProject.model.Utilisateur;
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
    public Demande createEquipmentRequest(EquipmentRequest request, String userEmail) {
        // Récupérer l'utilisateur connecté
        Utilisateur demandeur = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        // Créer la demande
        Demande demande = Demande.builder()
                .dateCreation(LocalDateTime.now())
                .description(request.getDescription())
                .demandeur(demandeur)
                .commentaireAutres(request.getEquipmentType() + (request.getRequestType() != null && !request.getRequestType().isEmpty() ? " - " + request.getRequestType() : ""))
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
        
        long total = userDemandes.size();
        long enCours = userDemandes.stream()
                .filter(d -> d.getDateCreation() != null) // À adapter selon votre logique métier
                .count();
        long acceptees = 0; // À adapter selon votre logique métier
        long refusees = 0; // À adapter selon votre logique métier
        long urgentes = userDemandes.stream()
                .filter(d -> d.getCommentaireAutres() != null && d.getCommentaireAutres().contains("critique"))
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
