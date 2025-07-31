package com.cosmarProject.cosumarProject.Controller;


import com.cosmarProject.cosumarProject.io.ProfileRequest;
import com.cosmarProject.cosumarProject.io.ProfileResponse;
import com.cosmarProject.cosumarProject.services.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1.0")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ProfileResponse register(@Valid  @RequestBody ProfileRequest request) {
        ProfileResponse response =profileService.createProfile(request);
        //TOODO: send welcome eimail
        return response;

    }



}
