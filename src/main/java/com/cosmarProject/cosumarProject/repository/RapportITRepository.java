package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.RapportIT;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RapportITRepository extends JpaRepository<RapportIT, Long> {
    @Query("SELECT r FROM RapportIT r WHERE r.demande.id_demande = :demandeId ORDER BY r.dateRapport DESC")
    List<RapportIT> findByDemandeIdOrderByDateRapportDesc(@Param("demandeId") Long demandeId);
    
    default Optional<RapportIT> findLatestByDemandeId(Long demandeId) {
        List<RapportIT> rapports = findByDemandeIdOrderByDateRapportDesc(demandeId);
        return rapports.isEmpty() ? Optional.empty() : Optional.of(rapports.get(0));
    }
}
