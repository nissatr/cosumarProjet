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

    public int deleteAllTypes() {
        try {
            System.out.println("🗑️ Suppression de TOUS les types de demandes");
            
            List<TypeDemande> allTypes = typeDemandeRepository.findAll();
            System.out.println("🗑️ Nombre total de types à supprimer: " + allTypes.size());
            
            for (TypeDemande type : allTypes) {
                System.out.println("🗑️ Suppression du type: " + type.getNomType() + " (ID: " + type.getId_Type() + ") - DetailType: " + type.getDetailType());
                typeDemandeRepository.delete(type);
            }
            
            System.out.println("✅ Suppression terminée: " + allTypes.size() + " types supprimés");
            return allTypes.size();
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la suppression: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la suppression: " + e.getMessage());
        }
    }

    public int createCorrectTypes() {
        try {
            System.out.println("🔄 Création des types de demandes corrects");
            
            // Créer les types avec DetailType
            typeDemandeRepository.save(TypeDemande.builder()
                    .nomType("Poste micro-ordinateur")
                    .detailType(TypeDemande.DetailType.NOUVEAU)
                    .aDetailType(true)
                    .build());
            
            typeDemandeRepository.save(TypeDemande.builder()
                    .nomType("Poste micro-ordinateur")
                    .detailType(TypeDemande.DetailType.CHANGEMENT)
                    .aDetailType(true)
                    .build());
            
            typeDemandeRepository.save(TypeDemande.builder()
                    .nomType("Imprimante")
                    .detailType(TypeDemande.DetailType.NOUVEAU)
                    .aDetailType(true)
                    .build());
            
            typeDemandeRepository.save(TypeDemande.builder()
                    .nomType("Imprimante")
                    .detailType(TypeDemande.DetailType.CHANGEMENT)
                    .aDetailType(true)
                    .build());
            
            // Créer les types SANS DetailType (aDetailType = false)
            typeDemandeRepository.save(TypeDemande.builder()
                    .nomType("Prise réseau")
                    .detailType(null)
                    .aDetailType(false)
                    .build());
            
            typeDemandeRepository.save(TypeDemande.builder()
                    .nomType("Logiciels")
                    .detailType(null)
                    .aDetailType(false)
                    .build());
            
            typeDemandeRepository.save(TypeDemande.builder()
                    .nomType("Autres")
                    .detailType(null)
                    .aDetailType(false)
                    .build());
            
            System.out.println("✅ 7 types de demandes créés correctement");
            return 7;
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la création: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la création: " + e.getMessage());
        }
    }
}
