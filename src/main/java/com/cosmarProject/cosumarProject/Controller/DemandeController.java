package com.cosmarProject.cosumarProject.Controller;

import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.model.StatutDemande;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import com.cosmarProject.cosumarProject.repository.DemandeRepository;
import com.cosmarProject.cosumarProject.repository.UtilisateurRepository;
import com.cosmarProject.cosumarProject.services.DemandeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DemandeController {
    private final DemandeService demandeService;
    private final UtilisateurRepository utilisateurRepository;
    private final DemandeRepository demandeRepository;


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

}
