package com.cosmarProject.cosumarProject.Controller;

import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.model.ServiceEntity;
import com.cosmarProject.cosumarProject.model.StatutDemande;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import com.cosmarProject.cosumarProject.repository.DemandeRepository;
import com.cosmarProject.cosumarProject.repository.ServiceRepository;
import com.cosmarProject.cosumarProject.repository.UtilisateurRepository;
import com.cosmarProject.cosumarProject.services.DemandeService;
import com.cosmarProject.cosumarProject.services.ValidationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import com.cosmarProject.cosumarProject.model.Validation;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
public class DemandeController {
    private final DemandeService demandeService;
    private final ServiceRepository serviceRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final DemandeRepository demandeRepository;
    private final ValidationService validationService;


    @GetMapping("/admin/demandes")
    public ResponseEntity<?> getAllDemandes() {
        try {
            System.out.println("🔄 Récupération de toutes les demandes");
            List<Map<String, Object>> demandes = demandeService.getAllDemandesForAdmin();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "demandes", demandes
            );
            
            System.out.println("✅ Demandes récupérées avec succès: " + demandes.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération des demandes: " + e.getMessage());
            Map<String, Object> error = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            return ResponseEntity.badRequest().body(error);
        }
    }
    @GetMapping("/mes-demandes")
    public ResponseEntity<?> getMesDemandes(Authentication authentication) {
        try {
            System.out.println("🔄 Récupération des demandes de l'utilisateur: " + authentication.getName());
            
            Utilisateur user = utilisateurRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            List<Demande> demandes = demandeRepository.findByDemandeur(user);
            
            Map<String, Object> response = Map.of(
                "success", true,
                "demandes", demandes
            );
            
            System.out.println("✅ Demandes de l'utilisateur récupérées avec succès: " + demandes.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération des demandes utilisateur: " + e.getMessage());
            Map<String, Object> error = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/cleanup-invalid-demands")
    public ResponseEntity<?> cleanupInvalidDemands() {
        try {
            System.out.println("🧹 Nettoyage des demandes liées aux types incorrects");
            
            // Trouver et supprimer les demandes liées au type "poste"
            List<Demande> invalidDemands = demandeRepository.findAll().stream()
                .filter(demande -> demande.getTypeDemande() != null && 
                                 demande.getTypeDemande().getNomType().equals("poste"))
                .collect(Collectors.toList());
            
            System.out.println("🗑️ Demandes incorrectes trouvées: " + invalidDemands.size());
            
            for (Demande demande : invalidDemands) {
                System.out.println("🗑️ Suppression de la demande ID: " + demande.getId_demande());
                demandeRepository.delete(demande);
            }
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Demandes incorrectes supprimées",
                "deletedCount", invalidDemands.size()
            );
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors du nettoyage: " + e.getMessage());
            Map<String, Object> error = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/delete-all-demands")
    public ResponseEntity<?> deleteAllDemands() {
        try {
            System.out.println("🗑️ Suppression de TOUTES les demandes");
            
            List<Demande> allDemands = demandeRepository.findAll();
            System.out.println("🗑️ Nombre total de demandes à supprimer: " + allDemands.size());
            
            for (Demande demande : allDemands) {
                System.out.println("🗑️ Suppression de la demande ID: " + demande.getId_demande() + 
                                 " - Type: " + (demande.getTypeDemande() != null ? demande.getTypeDemande().getNomType() : "null"));
                demandeRepository.delete(demande);
            }
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Toutes les demandes ont été supprimées",
                "deletedCount", allDemands.size()
            );
            
            System.out.println("✅ Suppression terminée: " + allDemands.size() + " demandes supprimées");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la suppression: " + e.getMessage());
            Map<String, Object> error = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            return ResponseEntity.badRequest().body(error);
        }
    }
    @PostMapping("/demandes/{id}/annuler")
    public ResponseEntity<Demande> annulerDemande(@PathVariable Long id) {
        Optional<Demande> optionalDemande = demandeRepository.findById(id);
        if(optionalDemande.isPresent()) {
            Demande demande = optionalDemande.get();
            demande.setStatut(StatutDemande.ANNULEE);  // ✅ Change le statut
            demandeRepository.save(demande); // ✅ Sauvegarde le changement
            return ResponseEntity.ok(demande);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/demandes/{id}")
    public ResponseEntity<Void> supprimerDemande(@PathVariable Long id) {
        if(demandeRepository.existsById(id)) {
            demandeRepository.deleteById(id); // Supprime la demande
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/demandes/service/{serviceId}")
    public ResponseEntity<?> getDemandesByService(@PathVariable Long serviceId) {
        try {
            System.out.println("🔄 Récupération des demandes pour le service ID : " + serviceId);

            // Récupérer le service
            ServiceEntity service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new RuntimeException("Service non trouvé"));

            // Récupérer les utilisateurs du service
            List<Utilisateur> usersInService = utilisateurRepository.findByService(service);

            // Filtrer les demandes EN_COURS
            List<Demande> demandes = demandeRepository.findAll().stream()
                    .filter(d -> usersInService.contains(d.getDemandeur()) &&
                            d.getStatut() == StatutDemande.EN_COURS)
                    .collect(Collectors.toList());

            Map<String, Object> response = Map.of(
                    "success", true,
                    "demandes", demandes
            );

            System.out.println("✅ Nombre de demandes récupérées : " + demandes.size());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération des demandes : " + e.getMessage());
            Map<String, Object> error = Map.of(
                    "success", false,
                    "message", e.getMessage()
            );
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/demandes/{id}/approve")
    public ResponseEntity<?> approveDemande(@PathVariable Long id, Authentication authentication) {
        try {
            // Récupérer l'utilisateur connecté
            String email = authentication.getName();
            Utilisateur validateur = utilisateurRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            // Utiliser le ValidationService pour créer l'enregistrement de validation
            validationService.validerDemande(id, validateur.getId_utilisateur(), "Manager N+1", true, "Approuvé par le manager N+1");
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Demande approuvée avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/demandes/{id}/reject")
    public ResponseEntity<?> rejectDemande(@PathVariable Long id, Authentication authentication) {
        try {
            // Récupérer l'utilisateur connecté
            String email = authentication.getName();
            Utilisateur validateur = utilisateurRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            // Utiliser le ValidationService pour créer l'enregistrement de validation
            validationService.validerDemande(id, validateur.getId_utilisateur(), "Manager N+1", false, "Refusé par le manager N+1");
            
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Demande refusée avec succès"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }




    @GetMapping("/demandes/manager/demandes")
    public ResponseEntity<?> getDemandesPourManager(Authentication authentication) {
        try {
            // Récupérer l'utilisateur connecté
            String email = authentication.getName();
            Utilisateur manager = utilisateurRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            // Vérifier que c'est bien un manager N+1
            if (!"Manager N+1".equals(manager.getRole().getNom())) {
                return ResponseEntity.status(403).body(Map.of(
                        "success", false,
                        "message", "Accès refusé : vous n'êtes pas un manager N+1"
                ));
            }

            Long serviceId = manager.getService().getId_service();

            // Récupérer les demandes en cours pour ce service
            List<Demande> demandes = demandeRepository.findAll().stream()
                    .filter(d -> d.getService().getId_service().equals(serviceId))
                    .filter(d -> d.getStatut() == StatutDemande.EN_COURS)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "demandes", demandes
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/demandes/mes-demandes-service")
    public ResponseEntity<?> getDemandesPourMonService(Authentication authentication) {
        try {
            System.out.println("🔄 Récupération des demandes pour le service de l'utilisateur: " + authentication.getName());

            // Récupérer l'utilisateur connecté
            String email = authentication.getName();
            Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            // Récupérer le service de l'utilisateur connecté
            ServiceEntity serviceUtilisateur = utilisateur.getService();
            if (serviceUtilisateur == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Aucun service associé à cet utilisateur"
                ));
            }

            System.out.println("🔍 Service de l'utilisateur: " + serviceUtilisateur.getNom());

            // ✅ Filtrer sur le service du demandeur, toutes les demandes (pas seulement EN_COURS)
            List<Demande> demandes = demandeRepository.findAll().stream()
                    .filter(d -> d.getDemandeur() != null &&
                            d.getDemandeur().getService() != null &&
                            d.getDemandeur().getService().getId_service()
                                    .equals(serviceUtilisateur.getId_service()))
                    .collect(Collectors.toList());

            System.out.println("✅ Nombre de demandes EN_COURS trouvées: " + demandes.size());

            Map<String, Object> response = Map.of(
                    "success", true,
                    "demandes", demandes
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération des demandes: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    // ===================== Support IT =====================
    @GetMapping("/demandes/support-it")
    public ResponseEntity<?> getDemandesPourSupportIT() {
        try {
            System.out.println("🔄 Récupération des demandes pour Support IT");
            
            // Debug: vérifier d'abord toutes les demandes
            List<Demande> toutesDemandes = demandeRepository.findAll();
            System.out.println("📊 Total des demandes en base: " + toutesDemandes.size());
            
            // Debug: vérifier les demandes avec statut EN_COURS
            List<Demande> demandesEnCours = toutesDemandes.stream()
                .filter(d -> d.getStatut() == StatutDemande.EN_COURS)
                .collect(Collectors.toList());
            System.out.println("📊 Demandes avec statut EN_COURS: " + demandesEnCours.size());
            
            // Debug: vérifier les validations existantes avec la méthode originale
            List<Demande> demandes = demandeRepository.findDemandesPourSupportIT();
            System.out.println("✅ Nombre de demandes trouvées pour Support IT (méthode originale): " + demandes.size());
            
            // Debug: essayer la méthode alternative
            List<Demande> demandesAlternative = demandeRepository.findDemandesValideesParManagerN1();
            System.out.println("✅ Nombre de demandes trouvées pour Support IT (méthode alternative): " + demandesAlternative.size());
            
            // Utiliser la méthode qui donne le plus de résultats
            List<Demande> demandesFinales = demandesAlternative.size() > demandes.size() ? demandesAlternative : demandes;
            System.out.println("✅ Nombre final de demandes pour Support IT: " + demandesFinales.size());
            
            // Debug: afficher les détails des demandes trouvées
            if (demandesFinales.size() > 0) {
                demandesFinales.forEach(d -> {
                    System.out.println("🔍 Demande ID: " + d.getId_demande() + 
                                     ", Statut: " + d.getStatut() + 
                                     ", Demandeur: " + (d.getDemandeur() != null ? d.getDemandeur().getEmail() : "null") +
                                     ", Service: " + (d.getDemandeur() != null && d.getDemandeur().getService() != null ? d.getDemandeur().getService().getNom() : "null") +
                                     ", Urgence: " + d.getUrgence() +
                                     ", Date création: " + d.getDateCreation());
                });
            } else {
                System.out.println("⚠️ Aucune demande trouvée pour Support IT");
                // Debug: afficher toutes les demandes EN_COURS pour comprendre pourquoi
                System.out.println("🔍 Détail des demandes EN_COURS:");
                demandesEnCours.forEach(d -> {
                    System.out.println("  - ID: " + d.getId_demande() + 
                                     ", Service: " + (d.getDemandeur() != null && d.getDemandeur().getService() != null ? d.getDemandeur().getService().getNom() : "null"));
                });
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "demandes", demandesFinales
            ));
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération des demandes Support IT: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    // ===================== ENDPOINT DE TEST =====================
    @GetMapping("/demandes/debug-support-it")
    public ResponseEntity<?> debugSupportIT() {
        try {
            System.out.println("🔍 DEBUG: Analyse des données pour Support IT");
            
            // Récupérer toutes les demandes
            List<Demande> toutesDemandes = demandeRepository.findAll();
            System.out.println("📊 Total des demandes: " + toutesDemandes.size());
            
            // Récupérer toutes les validations
            List<Validation> toutesValidations = validationService.getAllValidations();
            System.out.println("📊 Total des validations: " + toutesValidations.size());
            
            // Analyser les validations par niveau
            Map<String, Long> validationsParNiveau = toutesValidations.stream()
                .collect(Collectors.groupingBy(Validation::getNiveau, Collectors.counting()));
            System.out.println("📊 Validations par niveau: " + validationsParNiveau);
            
            // Analyser les validations par statut
            Map<String, Long> validationsParStatut = toutesValidations.stream()
                .collect(Collectors.groupingBy(Validation::getStatutValidation, Collectors.counting()));
            System.out.println("📊 Validations par statut: " + validationsParStatut);
            
            // Trouver les demandes avec validation Manager N+1 ACCEPTEE
            List<Demande> demandesValideesManager = toutesDemandes.stream()
                .filter(d -> d.getStatut() == StatutDemande.EN_COURS)
                .filter(d -> toutesValidations.stream()
                    .anyMatch(v -> v.getDemande().getId_demande().equals(d.getId_demande()) 
                        && "Manager N+1".equals(v.getNiveau()) 
                        && "ACCEPTEE".equals(v.getStatutValidation())))
                .collect(Collectors.toList());
            
            System.out.println("📊 Demandes validées par Manager N+1: " + demandesValideesManager.size());
            
            // Créer un rapport de debug
            Map<String, Object> debugInfo = Map.of(
                "totalDemandes", toutesDemandes.size(),
                "totalValidations", toutesValidations.size(),
                "validationsParNiveau", validationsParNiveau,
                "validationsParStatut", validationsParStatut,
                "demandesValideesManager", demandesValideesManager.size(),
                "demandesEnCours", toutesDemandes.stream().filter(d -> d.getStatut() == StatutDemande.EN_COURS).count()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "debugInfo", debugInfo
            ));
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors du debug: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}
