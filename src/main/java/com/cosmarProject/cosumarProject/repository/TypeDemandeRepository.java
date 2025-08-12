package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.TypeDemande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TypeDemandeRepository extends JpaRepository<TypeDemande, Long> {
    Optional<TypeDemande> findByNomTypeAndDetailType(String nomType, TypeDemande.DetailType detailType);
}
