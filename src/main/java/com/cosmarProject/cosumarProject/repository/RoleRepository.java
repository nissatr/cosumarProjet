package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByNom(String nom);

}
