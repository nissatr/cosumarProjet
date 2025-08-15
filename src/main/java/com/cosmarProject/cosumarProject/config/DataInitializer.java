package com.cosmarProject.cosumarProject.config;

import com.cosmarProject.cosumarProject.model.Role;
import com.cosmarProject.cosumarProject.model.ServiceEntity;
import com.cosmarProject.cosumarProject.model.TypeDemande;
import com.cosmarProject.cosumarProject.repository.RoleRepository;
import com.cosmarProject.cosumarProject.repository.ServiceRepository;
import com.cosmarProject.cosumarProject.repository.TypeDemandeRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final ServiceRepository serviceRepository;
    private final TypeDemandeRepository typeDemandeRepository;

    @PostConstruct
    public void init() {
        // Initialisation des rôles selon l'interface
        createRoleIfNotExists("demandeur");
        createRoleIfNotExists("Manager N+1");
        createRoleIfNotExists("SI");
        createRoleIfNotExists("Support IT");
        createRoleIfNotExists("Administrateur");
        createRoleIfNotExists("SUPER_ADMIN");

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

        // Initialisation des types de demandes selon le formulaire COSUMAR
        createTypeDemandeIfNotExists("Poste micro-ordinateur", TypeDemande.DetailType.NOUVEAU);
        createTypeDemandeIfNotExists("Poste micro-ordinateur", TypeDemande.DetailType.CHANGEMENT);
        createTypeDemandeIfNotExists("Imprimante", TypeDemande.DetailType.NOUVEAU);
        createTypeDemandeIfNotExists("Imprimante", TypeDemande.DetailType.CHANGEMENT);
        createTypeDemandeIfNotExists("Prise réseau", null);
        createTypeDemandeIfNotExists("Logiciels", null);
        createTypeDemandeIfNotExists("Autres", null);
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

    private void createTypeDemandeIfNotExists(String nomType, TypeDemande.DetailType detailType) {
        if (!typeDemandeRepository.findByNomTypeAndDetailType(nomType, detailType).isPresent()) {
            typeDemandeRepository.save(TypeDemande.builder()
                    .nomType(nomType)
                    .detailType(detailType)
                    .aDetailType(detailType != null) // true si detailType existe, false sinon
                    .build());
        }
    }
}
