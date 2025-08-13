package com.cosmarProject.cosumarProject.Controller;

import com.cosmarProject.cosumarProject.model.Demande;
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
    public List<Demande> getMesDemandes(Authentication authentication) {
        Utilisateur user = utilisateurRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return demandeRepository.findByDemandeur(user);
    }

}
