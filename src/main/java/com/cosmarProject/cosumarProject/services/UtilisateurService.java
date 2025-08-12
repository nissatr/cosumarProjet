package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.io.RegisterRequest;
import com.cosmarProject.cosumarProject.model.Role;
import com.cosmarProject.cosumarProject.model.ServiceEntity;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import com.cosmarProject.cosumarProject.repository.RoleRepository;
import com.cosmarProject.cosumarProject.repository.ServiceRepository;
import com.cosmarProject.cosumarProject.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final ServiceRepository serviceRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Créer un nouveau compte utilisateur
     */
    public Utilisateur createUser(RegisterRequest request) {
        try {
            // Vérifier si l'email existe déjà
            if (utilisateurRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Un utilisateur avec cet email existe déjà");
            }

            // Récupérer le rôle par défaut (demandeur)
            Role defaultRole = roleRepository.findByNom("demandeur")
                    .orElseGet(() -> {
                        // Créer le rôle demandeur si il n'existe pas
                        Role newRole = Role.builder()
                                .nom("demandeur")
                                .build();
                        return roleRepository.save(newRole);
                    });

            // Récupérer ou créer le service
            ServiceEntity service = serviceRepository.findByNom(request.getService())
                    .orElseGet(() -> {
                        ServiceEntity newService = ServiceEntity.builder()
                                .nom(request.getService())
                                .build();
                        return serviceRepository.save(newService);
                    });

            // Diviser le nom complet en prénom et nom
            String[] nameParts = request.getFullName().trim().split("\\s+", 2);
            String prenom = nameParts[0];
            String nom = nameParts.length > 1 ? nameParts[1] : "";

            // Créer l'utilisateur
            Utilisateur utilisateur = Utilisateur.builder()
                    .nom(nom)
                    .prenom(prenom)
                    .email(request.getEmail())
                    .motDePasse(passwordEncoder.encode(request.getPassword()))
                    .telephone(request.getTelephone())
                    .service(service)
                    .role(defaultRole)
                    .estActif(true)
                    .isAccountVerified(false)
                    .userId(UUID.randomUUID().toString())
                    .build();

            return utilisateurRepository.save(utilisateur);
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création de l'utilisateur: " + e.getMessage());
        }
    }

    public Utilisateur findByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'email: " + email));
    }

    public Utilisateur updateUser(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public List<Utilisateur> getAllUsers() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur updateUserRole(Long userId, String newRoleName) {
        System.out.println("🔍 Recherche de l'utilisateur avec l'ID: " + userId);
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID: " + userId));
        System.out.println("✅ Utilisateur trouvé: " + utilisateur.getEmail());
        
        System.out.println("🔍 Recherche du rôle: " + newRoleName);
        Role newRole = roleRepository.findByNom(newRoleName)
                .orElseThrow(() -> new RuntimeException("Rôle non trouvé: " + newRoleName));
        System.out.println("✅ Rôle trouvé: " + newRole.getNom());
        
        System.out.println("🔄 Mise à jour du rôle de " + utilisateur.getEmail() + " de " + 
                          (utilisateur.getRole() != null ? utilisateur.getRole().getNom() : "null") + 
                          " vers " + newRole.getNom());
        
        utilisateur.setRole(newRole);
        Utilisateur savedUser = utilisateurRepository.save(utilisateur);
        System.out.println("✅ Utilisateur sauvegardé avec succès");
        
        return savedUser;
    }

    public boolean superAdminExists() {
        return utilisateurRepository.findByRoleNom("SUPER_ADMIN").isPresent();
    }

    public Utilisateur createSuperAdmin(String email, String password) {
        // Vérifier si l'email existe déjà
        if (utilisateurRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }

        // Créer ou récupérer le rôle SUPER_ADMIN
        Role superAdminRole = roleRepository.findByNom("SUPER_ADMIN")
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .nom("SUPER_ADMIN")
                            .build();
                    return roleRepository.save(newRole);
                });

        // Créer ou récupérer le service Informatique
        ServiceEntity service = serviceRepository.findByNom("Informatique")
                .orElseGet(() -> {
                    ServiceEntity newService = ServiceEntity.builder()
                            .nom("Informatique")
                            .build();
                    return serviceRepository.save(newService);
                });

        Utilisateur superAdmin = Utilisateur.builder()
                .nom("Super")
                .prenom("Admin")
                .email(email)
                .motDePasse(passwordEncoder.encode(password))
                .telephone("0000000000")
                .service(service)
                .role(superAdminRole)
                .estActif(true)
                .isAccountVerified(true)
                .userId(UUID.randomUUID().toString())
                .build();

        return utilisateurRepository.save(superAdmin);
    }
}
