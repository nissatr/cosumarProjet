package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.Validation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ValidationRepository extends JpaRepository<Validation, Long> {
    @Query("SELECT v FROM Validation v WHERE v.demande.id_demande = :demandeId AND v.niveau = :niveau ORDER BY v.dateValidation DESC")
    List<Validation> findLatestByDemandeAndNiveau(@Param("demandeId") Long demandeId, @Param("niveau") String niveau);
}
