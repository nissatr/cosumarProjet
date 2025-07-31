package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.model.Utilisateur;
import com.cosmarProject.cosumarProject.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;


@Service
@RequiredArgsConstructor

public class AppUserDetailService implements UserDetailsService {

    private final UtilisateurRepository utilisateurRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Utilisateur existingUser=utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("email not found for the email: " + email));




        return new User(existingUser.getEmail(), existingUser.getMotDePasse(), new ArrayList<>());
    }
}
