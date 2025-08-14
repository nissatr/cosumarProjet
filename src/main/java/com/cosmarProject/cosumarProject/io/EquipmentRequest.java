package com.cosmarProject.cosumarProject.io;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentRequest {
    
    @NotBlank(message = "Le type d'équipement est obligatoire")
    private String equipmentType;
    
    private String requestType; // Nouveau ou Changement
    
    @NotBlank(message = "La description est obligatoire")
    private String description;
    
    @NotBlank(message = "Le niveau d'urgence est obligatoire")
    private String urgencyLevel;
    
    @NotNull(message = "La signature électronique est obligatoire")
    private Boolean signature;
    
    // Champ optionnel pour le détail de l'équipement personnalisé (pour "Autres")
    private String otherEquipmentDetail;
}
