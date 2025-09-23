package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.model.Validation;
import com.cosmarProject.cosumarProject.repository.DemandeRepository;
import com.cosmarProject.cosumarProject.repository.ValidationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DemandeService {
    private final DemandeRepository demandeRepository;
    private final ValidationRepository validationRepository;

    public List<Map<String, Object>> getAllDemandesForAdmin() {
        try {
            System.out.println("🔄 Récupération de toutes les demandes pour l'admin");
            List<Demande> demandes = demandeRepository.findAll();
            
            List<Map<String, Object>> demandesFormatted = demandes.stream()
                .map(demande -> {
                    // Calculer le statut réel basé sur les validations
                    String statutReel = calculerStatutReel(demande);
                    
                    Map<String, Object> demandeMap = new HashMap<>();
                    demandeMap.put("id", "REQ-" + String.format("%03d", demande.getId_demande()));
                    demandeMap.put("titre", demande.getDescription() != null ? demande.getDescription() : "Sans titre");
                    demandeMap.put("demandeur", demande.getDemandeur() != null ? 
                        demande.getDemandeur().getPrenom() + " " + demande.getDemandeur().getNom() : "Utilisateur inconnu");
                    demandeMap.put("role", demande.getDemandeur() != null && demande.getDemandeur().getRole() != null ? 
                        demande.getDemandeur().getRole().getNom() : "Rôle inconnu");
                    demandeMap.put("type", demande.getTypeDemande() != null ? 
                        demande.getTypeDemande().getNomType() + " (" + demande.getTypeDemande().getDetailType() + ")" : "Type non défini");
                    demandeMap.put("priorite", demande.getUrgence() != null ? demande.getUrgence().toString().toLowerCase() : "normale");
                    demandeMap.put("statut", statutReel);
                    demandeMap.put("date", demande.getDateCreation() != null ? 
                        demande.getDateCreation().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "Date inconnue");
                    
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

    /**
     * Créer une nouvelle demande
     */
    public Demande creerDemande(Demande demande) {
        try {
            // Sauvegarder la demande
            Demande demandeSauvegardee = demandeRepository.save(demande);
            
            System.out.println("✅ Demande créée: " + demandeSauvegardee.getId_demande());
            return demandeSauvegardee;
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la création de la demande: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la création de la demande: " + e.getMessage());
        }
    }

    /**
     * Calculer le statut réel d'une demande basé sur les validations
     */
    private String calculerStatutReel(Demande demande) {
        try {
            System.out.println("🔍 Calcul du statut pour la demande " + demande.getId_demande());
            
            // Récupérer toutes les validations pour cette demande
            List<Validation> validations = validationRepository.findByDemande(demande);
            System.out.println("📋 Nombre de validations trouvées: " + validations.size());
            
            if (validations.isEmpty()) {
                System.out.println("⚠️ Aucune validation trouvée - statut: en attente");
                return "en attente"; // Aucune validation = en attente de Manager N+1
            }
            
            // Afficher toutes les validations pour debug
            for (Validation v : validations) {
                System.out.println("  - Niveau: '" + v.getNiveau() + "', Statut: '" + v.getStatutValidation() + "'");
            }
            
            // Vérifier s'il y a un refus
            boolean hasRefus = validations.stream()
                .anyMatch(v -> "REFUSEE".equals(v.getStatutValidation()));
            
            if (hasRefus) {
                System.out.println("❌ Refus détecté - statut: refusée");
                return "refusée";
            }
            
            // Vérifier les étapes de validation
            boolean managerApprouve = validations.stream()
                .anyMatch(v -> "Manager N+1".equals(v.getNiveau()) && "ACCEPTEE".equals(v.getStatutValidation()));
            
            boolean supportITApprouve = validations.stream()
                .anyMatch(v -> "Support IT".equals(v.getNiveau()) && "ACCEPTEE".equals(v.getStatutValidation()));
            
            boolean siApprouve = validations.stream()
                .anyMatch(v -> "SI".equals(v.getNiveau()) && "ACCEPTEE".equals(v.getStatutValidation()));
            
            boolean adminApprouve = validations.stream()
                .anyMatch(v -> "Administration".equals(v.getNiveau()) && "ACCEPTEE".equals(v.getStatutValidation()));
            
            System.out.println("📊 État des validations:");
            System.out.println("  - Manager N+1: " + managerApprouve);
            System.out.println("  - Support IT: " + supportITApprouve);
            System.out.println("  - SI: " + siApprouve);
            System.out.println("  - Administration: " + adminApprouve);
            
            // Déterminer le statut selon les étapes validées
            // Une demande est "approuvée" seulement quand TOUTES les étapes sont terminées
            if (adminApprouve && siApprouve && supportITApprouve && managerApprouve) {
                System.out.println("✅ Toutes les étapes terminées - statut: approuvée");
                return "approuvée";
            } else if (adminApprouve && siApprouve && supportITApprouve) {
                System.out.println("🔄 Administration en cours - statut: en cours (Administration)");
                return "en cours (Administration)";
            } else if (siApprouve && supportITApprouve) {
                System.out.println("🔄 SI en cours - statut: en cours (SI)");
                return "en cours (SI)";
            } else if (supportITApprouve && managerApprouve) {
                System.out.println("🔄 Support IT en cours - statut: en cours (Support IT)");
                return "en cours (Support IT)";
            } else if (managerApprouve) {
                System.out.println("🔄 Manager N+1 en cours - statut: en cours (Manager N+1)");
                return "en cours (Manager N+1)";
            } else {
                System.out.println("⏳ Aucune étape approuvée - statut: en attente");
                return "en attente";
            }
            
        } catch (Exception e) {
            System.err.println("❌ Erreur lors du calcul du statut pour la demande " + demande.getId_demande() + ": " + e.getMessage());
            return "en cours";
        }
    }
}
