package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    Optional<ServiceEntity> findByNom(String nom);
}
