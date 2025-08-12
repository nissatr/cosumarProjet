package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<Utilisateur> findByRoleNom(String roleNom);
}