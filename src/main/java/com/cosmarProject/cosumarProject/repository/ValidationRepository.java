package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.Validation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ValidationRepository extends JpaRepository<Validation, Long> {
    @Query("SELECT v FROM Validation v WHERE v.demande.id_demande = :demandeId AND v.niveau = :niveau ORDER BY v.dateValidation DESC")
    List<Validation> findLatestByDemandeAndNiveau(@Param("demandeId") Long demandeId, @Param("niveau") String niveau);
    
    @Query("SELECT COUNT(v) > 0 FROM Validation v WHERE v.demande = :demande AND v.validateur = :validateur")
    boolean existsByDemandeAndValidateur(@Param("demande") com.cosmarProject.cosumarProject.model.Demande demande, @Param("validateur") com.cosmarProject.cosumarProject.model.Utilisateur validateur);
    
    @Query("SELECT v FROM Validation v WHERE v.validateur = :validateur")
    List<Validation> findByValidateur(@Param("validateur") com.cosmarProject.cosumarProject.model.Utilisateur validateur);
    
    // Méthode pour trouver toutes les validations d'une demande
    List<Validation> findByDemande(com.cosmarProject.cosumarProject.model.Demande demande);
    
    // Méthode pour vérifier si une validation existe pour une demande et un niveau spécifique
    @Query("SELECT COUNT(v) > 0 FROM Validation v WHERE v.demande = :demande AND v.niveau = :niveau")
    boolean existsByDemandeAndNiveau(@Param("demande") com.cosmarProject.cosumarProject.model.Demande demande, @Param("niveau") String niveau);
}
