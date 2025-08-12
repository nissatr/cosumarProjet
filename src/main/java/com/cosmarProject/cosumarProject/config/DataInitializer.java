package com.cosmarProject.cosumarProject.config;

import com.cosmarProject.cosumarProject.model.Role;
import com.cosmarProject.cosumarProject.model.ServiceEntity;
import com.cosmarProject.cosumarProject.repository.RoleRepository;
import com.cosmarProject.cosumarProject.repository.ServiceRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final ServiceRepository serviceRepository;

    @PostConstruct
    public void init() {
        // Initialisation des rôles principaux
        createRoleIfNotExists("demandeur");
        createRoleIfNotExists("ADMIN");
        createRoleIfNotExists("SUPER_ADMIN");
        
        // Initialisation des rôles supplémentaires
        createRoleIfNotExists("support_it");
        createRoleIfNotExists("manager");
        createRoleIfNotExists("administration");
        createRoleIfNotExists("si");

        // Initialisation des services
        createServiceIfNotExists("Informatique");
        createServiceIfNotExists("RH");
        createServiceIfNotExists("Direction");
        createServiceIfNotExists("Production");
        createServiceIfNotExists("Qualité");
        createServiceIfNotExists("Maintenance");
        createServiceIfNotExists("Finance");
        createServiceIfNotExists("Logistique");
        createServiceIfNotExists("Commercial");
    }

    private void createRoleIfNotExists(String roleName) {
        if (!roleRepository.findByNom(roleName).isPresent()) {
            roleRepository.save(Role.builder().nom(roleName).build());
        }
    }

    private void createServiceIfNotExists(String serviceName) {
        if (!serviceRepository.findByNom(serviceName).isPresent()) {
            serviceRepository.save(ServiceEntity.builder().nom(serviceName).build());
        }
    }
}
