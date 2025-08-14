package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DemandeRepository extends JpaRepository<Demande, Long> {
    List<Demande> findByDemandeur(Utilisateur demandeur);
    // Manager N+1 : voit les demandes de son service qui n'ont pas encore de validation niveau "Manager N+1"
    @Query("""
        SELECT d FROM Demande d
        WHERE d.service.id_service = :serviceId
        AND d.statut = 'EN_COURS'
        AND NOT EXISTS (
            SELECT v FROM Validation v
            WHERE v.demande = d
            AND v.niveau = 'Manager N+1'
        )
    """)
    List<Demande> findDemandesPourManager(@Param("serviceId") Long serviceId);

    // Support IT : voit les demandes validées par Manager N+1
    @Query("""
        SELECT DISTINCT d FROM Demande d
        JOIN d.demandeur u
        JOIN u.service s
        WHERE d.statut = 'EN_COURS'
        AND EXISTS (
            SELECT v FROM Validation v
            WHERE v.demande = d
            AND v.niveau = 'Manager N+1'
            AND v.statutValidation = 'ACCEPTEE'
        )
        AND NOT EXISTS (
            SELECT v FROM Validation v
            WHERE v.demande = d
            AND v.niveau = 'Support IT'
        )
    """)
    List<Demande> findDemandesPourSupportIT();


    @Query("""
    SELECT d FROM Demande d
    WHERE d.service.id_service = :serviceId
    AND d.statut = 'EN_COURS'
""")
    List<Demande> findDemandesEnCoursParService(@Param("serviceId") Long serviceId);


}