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

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

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

            String nomFichier = null;
            String nomFichierUnique = null;
            
            // Gérer l'upload et le stockage du fichier
            if (fichier != null && !fichier.isEmpty()) {
                try {
                    // Créer le dossier uploads/rapports-it s'il n'existe pas
                    String uploadDir = "uploads/rapports-it";
                    File dir = new File(uploadDir);
                    if (!dir.exists()) {
                        dir.mkdirs();
                    }
                    
                    // Générer un nom unique pour le fichier
                    String extension = "";
                    String originalFilename = fichier.getOriginalFilename();
                    if (originalFilename != null && originalFilename.contains(".")) {
                        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }
                    String nomUnique = UUID.randomUUID().toString() + extension;
                    
                    // Sauvegarder le fichier
                    Path filePath = Paths.get(uploadDir, nomUnique);
                    Files.copy(fichier.getInputStream(), filePath);
                    
                    nomFichier = originalFilename; // Garder le nom original pour l'affichage
                    nomFichierUnique = nomUnique; // Garder le nom unique pour le téléchargement
                    
                } catch (IOException e) {
                    return ResponseEntity.status(500).body(Map.of(
                            "success", false,
                            "message", "Erreur lors du stockage du fichier: " + e.getMessage()
                    ));
                }
            }

            RapportIT rapport = RapportIT.builder()
                    .demande(demande)
                    .supportIT(support)
                    .commentaire(commentaire)
                    .nomFichier(nomFichier)
                    .nomFichierUnique(nomFichierUnique)
                    .dateRapport(LocalDateTime.now())
                    .build();

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
                    "nomFichier", rapport.getNomFichier(),
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
    
    @GetMapping("/demandes/{id}/rapport-it/download")
    public ResponseEntity<?> downloadRapportIT(@PathVariable Long id) {
        try {
            RapportIT rapport = rapportITRepository.findLatestByDemandeId(id)
                    .orElse(null);
            
            if (rapport == null || rapport.getNomFichierUnique() == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Construire le chemin du fichier avec le nom unique
            String uploadDir = "uploads/rapports-it";
            Path filePath = Paths.get(uploadDir, rapport.getNomFichierUnique());
            
            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }
            
            // Lire le fichier
            byte[] fileContent = Files.readAllBytes(filePath);
            
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + rapport.getNomFichier() + "\"")
                    .body(fileContent);
                    
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }
}
