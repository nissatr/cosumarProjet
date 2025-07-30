package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface ServiceRepository extends JpaRepository<Service, Long> {
    Optional<com.cosmarProject.cosumarProject.model.Service> findByNom(String nom);
}
