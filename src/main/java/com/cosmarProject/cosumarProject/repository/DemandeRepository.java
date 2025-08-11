package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.Demande;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DemandeRepository extends JpaRepository<Demande, Long> {
    List<Demande> findByDemandeur(Utilisateur demandeur);
}
