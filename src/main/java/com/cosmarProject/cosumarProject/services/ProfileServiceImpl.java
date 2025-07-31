package com.cosmarProject.cosumarProject.services;


import com.cosmarProject.cosumarProject.io.ProfileRequest;
import com.cosmarProject.cosumarProject.io.ProfileResponse;
import com.cosmarProject.cosumarProject.model.Role;
import com.cosmarProject.cosumarProject.model.ServiceEntity;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import com.cosmarProject.cosumarProject.repository.RoleRepository;
import com.cosmarProject.cosumarProject.repository.ServiceRepository;
import com.cosmarProject.cosumarProject.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final ServiceRepository serviceRepository;


    @Override
    public ProfileResponse createProfile(ProfileRequest request) {


        Role demandeurRole = roleRepository.findByNom("demandeur")
                .orElseThrow(() -> new RuntimeException("Rôle 'demandeur' non trouvé"));

        Utilisateur newProfile = convertToUtilisateurEntity(request, demandeurRole);

        if(!utilisateurRepository.existsByEmail(request.getEmail())) {
            newProfile = utilisateurRepository.save(newProfile);

            return convertToProfileResponse(newProfile);

        }else{
            throw new ResponseStatusException(HttpStatus.CONFLICT , "email already exist");
        }



    }
    private ProfileResponse convertToProfileResponse(Utilisateur utilisateur) {
        return ProfileResponse.builder()
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .userId(utilisateur.getId_utilisateur().toString())
                .isAccountVerified(utilisateur.getIsAccountVerified())
                .build();
    }


    private Utilisateur convertToUtilisateurEntity(ProfileRequest request, Role role) {
        // Récupérer le rôle "demandeur"

        Role demandeurRole = roleRepository.findByNom("demandeur")
                .orElseThrow(() -> new RuntimeException("Rôle 'demandeur' non trouvé"));
        // Chercher le service par son nom
        ServiceEntity service = serviceRepository.findByNom(request.getServiceName())
                .orElseThrow(() -> new RuntimeException("Service non trouvé: " + request.getServiceName()));



        return Utilisateur.builder()
                .email(request.getEmail())
                .userId(UUID.randomUUID().toString())
                .prenom(request.getPrenom())
                .nom(request.getName())
                .motDePasse(request.getPassword())
                .isAccountVerified(false)
                .resetOtpExpiredAt(0)
                .verifyOtp(null)
                .verifyOtpExpiredAt(0)
                .resetOtp(null)
                .service(service) // <- ici tu ajoutes le service sélectionné
                .role(demandeurRole) // <- assigner le rôle ici
                .build();
    }

}
