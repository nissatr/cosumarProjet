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
        // Initialisation des rôles
        createRoleIfNotExists("demandeur");
        createRoleIfNotExists("manager");
        createRoleIfNotExists("support_it");
        createRoleIfNotExists("administration");
        createRoleIfNotExists("si");
        createRoleIfNotExists("super_admin");

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
        roleRepository.findByNom(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder().nom(roleName).build()));
    }

    private void createServiceIfNotExists(String serviceName) {
        serviceRepository.findByNom(serviceName)
                .orElseGet(() -> serviceRepository.save(ServiceEntity.builder().nom(serviceName).build()));
    }
}
