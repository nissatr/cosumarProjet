package com.cosmarProject.cosumarProject.Controller;

import com.cosmarProject.cosumarProject.io.EquipmentRequest;
import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.services.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/equipment")
@RequiredArgsConstructor
public class EquipmentController {
    
    private final EquipmentService equipmentService;
    
    /**
     * Créer une nouvelle demande d'équipement
     */
    @PostMapping("/request")
    public ResponseEntity<?> createEquipmentRequest(
            @Valid @RequestBody EquipmentRequest request,
            @CurrentSecurityContext(expression = "authentication?.name") String userEmail
    ) {
        try {
            Demande demande = equipmentService.createEquipmentRequest(request, userEmail);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Demande d'équipement créée avec succès");
            response.put("demandeId", demande.getId_demande());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur lors de la création de la demande: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Récupérer toutes les demandes de l'utilisateur connecté
     */
    @GetMapping("/requests")
    public ResponseEntity<?> getUserRequests(
            @CurrentSecurityContext(expression = "authentication?.name") String userEmail
    ) {
        try {
            List<Demande> demandes = equipmentService.getUserRequests(userEmail);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("demandes", demandes);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur lors de la récupération des demandes: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Récupérer les statistiques du dashboard
     */
    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(
            @CurrentSecurityContext(expression = "authentication?.name") String userEmail
    ) {
        try {
            EquipmentService.DashboardStats stats = equipmentService.getDashboardStats(userEmail);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur lors de la récupération des statistiques: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    /**
     * Récupérer une demande spécifique par ID
     */
    @GetMapping("/request/{id}")
    public ResponseEntity<?> getRequestById(
            @PathVariable Long id,
            @CurrentSecurityContext(expression = "authentication?.name") String userEmail
    ) {
        try {
            // TODO: Implémenter la logique pour récupérer une demande spécifique
            // et vérifier que l'utilisateur connecté est bien le propriétaire
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Fonctionnalité à implémenter");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur lors de la récupération de la demande: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(error);
        }
    }
}
