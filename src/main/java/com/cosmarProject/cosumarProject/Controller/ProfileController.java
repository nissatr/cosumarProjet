package com.cosmarProject.cosumarProject.Controller;


import com.cosmarProject.cosumarProject.io.ProfileRequest;
import com.cosmarProject.cosumarProject.io.ProfileResponse;
import com.cosmarProject.cosumarProject.services.EmailService;
import com.cosmarProject.cosumarProject.services.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final EmailService emailService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid  @RequestBody ProfileRequest request) {
        ProfileResponse response =profileService.createProfile(request);
        //TOODO: send welcome eimail
        emailService.sendWelcomeEmail(response.getEmail(), response.getNom());
        return response;

    }

    @GetMapping("/profile")
    public ProfileResponse getProfile(@CurrentSecurityContext(expression = " authentication?.name")String email) {

        return profileService.getProfile(email);
    }



}
