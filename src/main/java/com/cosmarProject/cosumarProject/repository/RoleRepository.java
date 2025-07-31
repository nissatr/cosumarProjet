package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByNom(String nom);

    @Query("SELECT r.id_role FROM Role r WHERE r.nom = :nom")
    Optional<Long> findIdByNom(@Param("nom") String nom);

}
