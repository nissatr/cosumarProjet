package com.cosmarProject.cosumarProject.Controller;

import com.cosmarProject.cosumarProject.services.TypeDemandeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TypeDemandeController {

    private final TypeDemandeService typeDemandeService;

    public TypeDemandeController(TypeDemandeService typeDemandeService) {
        this.typeDemandeService = typeDemandeService;
    }

    @GetMapping("/type-demandes")
    public ResponseEntity<?> getAllTypeDemandes() {
        try {
            System.out.println("🔄 Récupération de tous les types de demandes");
            List<Map<String, Object>> types = typeDemandeService.getAllTypeDemandes();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "types", types
            );
            
            System.out.println("✅ Types de demandes récupérés avec succès: " + types.size());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération des types de demandes: " + e.getMessage());
            Map<String, Object> error = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/type-demandes/delete-all")
    public ResponseEntity<?> deleteAllTypes() {
        try {
            System.out.println("🗑️ Suppression de tous les types de demandes");
            int deletedCount = typeDemandeService.deleteAllTypes();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Tous les types ont été supprimés",
                "deletedCount", deletedCount
            );
            
            System.out.println("✅ Suppression terminée: " + deletedCount + " types supprimés");
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

    @PostMapping("/type-demandes/create")
    public ResponseEntity<?> createCorrectTypes() {
        try {
            System.out.println("🔄 Création des types de demandes corrects");
            int createdCount = typeDemandeService.createCorrectTypes();
            
            Map<String, Object> response = Map.of(
                "success", true,
                "message", "Types créés avec succès",
                "createdCount", createdCount
            );
            
            System.out.println("✅ Types créés: " + createdCount);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la création: " + e.getMessage());
            Map<String, Object> error = Map.of(
                "success", false,
                "message", e.getMessage()
            );
            return ResponseEntity.badRequest().body(error);
        }
    }
}
