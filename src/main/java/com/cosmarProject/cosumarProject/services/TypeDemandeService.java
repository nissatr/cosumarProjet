package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.model.TypeDemande;
import com.cosmarProject.cosumarProject.repository.TypeDemandeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TypeDemandeService {

    private final TypeDemandeRepository typeDemandeRepository;

    public TypeDemandeService(TypeDemandeRepository typeDemandeRepository) {
        this.typeDemandeRepository = typeDemandeRepository;
    }

    public List<Map<String, Object>> getAllTypeDemandes() {
        try {
            System.out.println("🔄 Récupération de tous les types de demandes");
            List<TypeDemande> types = typeDemandeRepository.findAll();
            
            List<Map<String, Object>> typesFormatted = types.stream()
                .map(type -> {
                    Map<String, Object> typeMap = Map.of(
                        "id", type.getId_Type(),
                        "nom", type.getNomType(),
                        "detailType", type.getDetailType() != null ? type.getDetailType().toString() : "N/A",
                        "aDetailType", type.getADetailType()
                    );
                    return typeMap;
                })
                .collect(Collectors.toList());
            
            System.out.println("✅ Types formatés: " + typesFormatted.size());
            return typesFormatted;
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la récupération des types de demandes: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la récupération des types de demandes: " + e.getMessage());
        }
    }
}
