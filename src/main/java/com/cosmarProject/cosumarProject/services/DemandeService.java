package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.repository.DemandeRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DemandeService {
    private final DemandeRepository demandeRepository;

    public DemandeService(DemandeRepository demandeRepository) {
        this.demandeRepository = demandeRepository;
    }

    public List<Map<String, Object>> getAllDemandesForAdmin() {
        try {
            System.out.println("🔄 Récupération de toutes les demandes pour l'admin");
            List<Demande> demandes = demandeRepository.findAll();
            
            List<Map<String, Object>> demandesFormatted = demandes.stream()
                .map(demande -> {
                    Map<String, Object> demandeMap = Map.of(
                        "id", "REQ-" + String.format("%03d", demande.getId_demande()),
                        "titre", demande.getDescription() != null ? demande.getDescription() : "Sans titre",
                        "demandeur", demande.getDemandeur() != null ? 
                            demande.getDemandeur().getPrenom() + " " + demande.getDemandeur().getNom() : "Utilisateur inconnu",
                        "role", demande.getDemandeur() != null && demande.getDemandeur().getRole() != null ? 
                            demande.getDemandeur().getRole().getNom() : "Rôle inconnu",
                        "type", demande.getTypeDemande() != null ? 
                            demande.getTypeDemande().getNomType() + " (" + demande.getTypeDemande().getDetailType() + ")" : "Type non défini",
                        "priorite", "moyenne", // Valeur par défaut car pas dans le modèle
                        "statut", "en cours", // Valeur par défaut car pas dans le modèle
                        "date", demande.getDateCreation() != null ? 
                            demande.getDateCreation().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "Date inconnue"
                    );
                    return demandeMap;
                })
                .collect(Collectors.toList());
            
            System.out.println("✅ Demandes formatées: " + demandesFormatted.size());
            return demandesFormatted;
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération des demandes: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la récupération des demandes: " + e.getMessage());
        }
    }
}
