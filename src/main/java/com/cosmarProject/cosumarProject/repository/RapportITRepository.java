package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.RapportIT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RapportITRepository extends JpaRepository<RapportIT, Long> {
    @Query("SELECT r FROM RapportIT r WHERE r.demande.id_demande = :demandeId ORDER BY r.dateRapport DESC")
    Optional<RapportIT> findLatestByDemandeId(@Param("demandeId") Long demandeId);
}
