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

    // Support IT : voit les demandes validées par Manager N+1 de tous services
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
        ORDER BY d.urgence DESC, d.dateCreation ASC
    """)
    List<Demande> findDemandesPourSupportIT();

    // Méthode alternative plus simple pour Support IT
    @Query("""
        SELECT d FROM Demande d
        WHERE d.statut = 'EN_COURS'
        AND EXISTS (
            SELECT v FROM Validation v
            WHERE v.demande = d
            AND v.niveau = 'Manager N+1'
            AND v.statutValidation = 'ACCEPTEE'
        )
    """)
    List<Demande> findDemandesValideesParManagerN1();


    @Query("""
    SELECT d FROM Demande d
    WHERE d.service.id_service = :serviceId
    AND d.statut = 'EN_COURS'
""")
    List<Demande> findDemandesEnCoursParService(@Param("serviceId") Long serviceId);


    // SI : toutes les demandes EN_COURS validées par Manager N+1,
    // ayant un rapport IT du Support IT (validées ou non par SI)
    @Query("""
        SELECT d FROM Demande d
        WHERE d.statut = 'EN_COURS'
        AND EXISTS (
            SELECT v1 FROM Validation v1
            WHERE v1.demande = d
            AND v1.niveau = 'Manager N+1'
            AND v1.statutValidation = 'ACCEPTEE'
        )
        AND EXISTS (
            SELECT r FROM RapportIT r WHERE r.demande = d
        )
        ORDER BY d.dateCreation ASC
    """)
    List<Demande> findDemandesPourSI();

    // Administrateur : toutes les demandes EN_COURS validées par Manager N+1, Support IT et SI
    @Query("""
        SELECT d FROM Demande d
        WHERE d.statut = 'EN_COURS'
        AND EXISTS (
            SELECT v1 FROM Validation v1
            WHERE v1.demande = d
            AND v1.niveau = 'Manager N+1'
            AND v1.statutValidation = 'ACCEPTEE'
        )
        AND EXISTS (
            SELECT v2 FROM Validation v2
            WHERE v2.demande = d
            AND v2.niveau = 'Support IT'
            AND v2.statutValidation = 'ACCEPTEE'
        )
        AND EXISTS (
            SELECT v3 FROM Validation v3
            WHERE v3.demande = d
            AND v3.niveau = 'SI'
            AND v3.statutValidation = 'ACCEPTEE'
        )
        AND NOT EXISTS (
            SELECT v4 FROM Validation v4
            WHERE v4.demande = d AND v4.niveau = 'Administration'
        )
        ORDER BY d.dateCreation ASC
    """)
    List<Demande> findDemandesPourAdministrateur();

}