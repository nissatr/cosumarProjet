package com.cosmarProject.cosumarProject.Controller;

import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.model.RapportIT;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import com.cosmarProject.cosumarProject.repository.DemandeRepository;
import com.cosmarProject.cosumarProject.repository.RapportITRepository;
import com.cosmarProject.cosumarProject.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import com.cosmarProject.cosumarProject.services.ValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class RapportITController {
    private final RapportITRepository rapportITRepository;
    private final DemandeRepository demandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final ValidationService validationService;

    @PostMapping("/demandes/{id}/rapport-it")
    public ResponseEntity<?> soumettreRapportIT(
            @PathVariable Long id,
            @RequestParam(value = "fichier", required = false) MultipartFile fichier,
            @RequestParam(value = "commentaire", required = false) String commentaire,
            Authentication authentication
    ) {
        try {
            Demande demande = demandeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

            Utilisateur support = utilisateurRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            RapportIT rapport = RapportIT.builder()
                    .demande(demande)
                    .supportIT(support)
                    .commentaire(commentaire)
                    .dateRapport(LocalDateTime.now())
                    .build();

            // TODO: gérer la persistance du fichier (stockage) si nécessaire

            rapportITRepository.save(rapport);

            // Enregistrer la validation Support IT (sans changer le statut global)
            validationService.validerDemande(id, support.getId_utilisateur(), "Support IT", true, "Rapport technique soumis");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Rapport IT soumis"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/demandes/{id}/rapport-it")
    public ResponseEntity<?> getRapportIT(@PathVariable Long id) {
        try {
            RapportIT rapport = rapportITRepository.findLatestByDemandeId(id)
                    .orElse(null);
            
            if (rapport == null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "rapportIT", null
                ));
            }

            Map<String, Object> rapportData = Map.of(
                    "id", rapport.getId_rapport_it(),
                    "dateRapport", rapport.getDateRapport(),
                    "commentaire", rapport.getCommentaire(),
                    "supportIT", Map.of(
                            "id", rapport.getSupportIT().getId_utilisateur(),
                            "nom", rapport.getSupportIT().getNom(),
                            "prenom", rapport.getSupportIT().getPrenom()
                    )
            );

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "rapportIT", rapportData
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}
