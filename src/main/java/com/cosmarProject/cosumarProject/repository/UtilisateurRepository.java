package com.cosmarProject.cosumarProject.repository;

import com.cosmarProject.cosumarProject.model.ServiceEntity;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmail(String email);
    Boolean existsByEmail(String email);
    Optional<Utilisateur> findByRoleNom(String roleNom);

    // ✅ Comparer le nom du service au lieu de l'objet entier
    List<Utilisateur> findByService(ServiceEntity service);
}