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

            // Récupérer ou créer le rôle par défaut (utilisateur)
            Role defaultRole = roleRepository.findById(1L)
                    .orElseGet(() -> {
                        // Créer un rôle par défaut si il n'existe pas
                        Role newRole = Role.builder()
                                .nom("UTILISATEUR")
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
}
