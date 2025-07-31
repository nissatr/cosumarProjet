package com.cosmarProject.cosumarProject.io;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileResponse {

    private String nom;
    private String prenom;
    private String userId;
    private String email;
    private Boolean isAccountVerified;


}
