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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final PasswordEncoder passwordEncoder;
    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final ServiceRepository serviceRepository;
    private final EmailService emailService;


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

    @Override
    public ProfileResponse getProfile(String email) {
        Utilisateur existingUser = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found" +email));
        return convertToProfileResponse(existingUser);
    }

    @Override
    public void sendReset0tp(String email) {
        Utilisateur existingEntity = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found" +email));

        //Generate 6 digit otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        //calculate expiry time (current time + 15minutes in milliseconds)
        long expiryTime =System.currentTimeMillis() +(15 * 60*1000);

        //update the profile /user
        existingEntity.setResetOtp(otp);
        existingEntity.setResetOtpExpiredAt(expiryTime);

        //save into the database
        utilisateurRepository.save(existingEntity);

        try{
            emailService.sendOtpEmail(existingEntity.getEmail(), otp);

        }catch (Exception ex){
            throw new RuntimeException("unable to send email");

        }
    }

    @Override
    public void resetPassword(String email, String otp, String newPassword) {
        Utilisateur  existingUser = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found" +email));
        if(existingUser.getResetOtp() == null || !existingUser.getResetOtp().equals(otp)){
             throw new RuntimeException("Invalid Otp");
        }
        if(existingUser.getResetOtpExpiredAt() < System.currentTimeMillis()){
            throw new RuntimeException("Otp Expired");
        }
        existingUser.setMotDePasse(passwordEncoder.encode(newPassword));
        existingUser.setResetOtp(null);
        existingUser.setResetOtpExpiredAt(0L);
        utilisateurRepository.save(existingUser);
    }

    @Override
    public void sendOtp(String email) {
        Utilisateur existingUser =utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found" +email));
        if(existingUser.getIsAccountVerified() != null && existingUser.getIsAccountVerified()){
            return;
        }
        //Generate 6 digit otp
        String otp = String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));

        //calculate expiry time (current time + 24 hours in milliseconds)
        long expiryTime =System.currentTimeMillis() +(24 *60 * 60*1000);

        //update the user entity
        existingUser.setVerifyOtp(otp);
        existingUser.setVerifyOtpExpiredAt(expiryTime);

        //save to database
        utilisateurRepository.save(existingUser);
        // ✅ Envoi du mail
        try {
            emailService.sendOtpEmail(existingUser.getEmail(), otp);
        } catch (Exception ex) {
            throw new RuntimeException("Unable to send email: " + ex.getMessage(), ex);
        }

    }

    @Override
    public void verifyOtp(String email, String otp) {
        Utilisateur existingUser= utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found" +email));
        if(existingUser.getVerifyOtp() == null || !existingUser.getVerifyOtp().equals(otp)){
            throw new RuntimeException("Invalid Otp");
        }
        if(existingUser.getVerifyOtpExpiredAt() < System.currentTimeMillis()){
            throw new RuntimeException("Otp Expired");
        }

        existingUser.setIsAccountVerified(true);
        existingUser.setVerifyOtp(null);
        existingUser.setVerifyOtpExpiredAt(0L);
        utilisateurRepository.save(existingUser);
    }

    @Override
    public String getLoggedInUserId(String email) {
        Utilisateur existingUser = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found" +email));
        return existingUser.getUserId();
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
                .motDePasse(passwordEncoder.encode(request.getPassword() ))
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
