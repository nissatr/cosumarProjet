package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.model.Role;
import com.cosmarProject.cosumarProject.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {
    
    private final RoleRepository roleRepository;
    
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
    
    public Role findByNom(String nom) {
        return roleRepository.findByNom(nom)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé: " + nom));
    }
    
    public Role createRole(String nom) {
        Role role = Role.builder()
                .nom(nom)
                .build();
        return roleRepository.save(role);
    }
}
