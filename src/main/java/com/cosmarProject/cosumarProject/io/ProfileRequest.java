package com.cosmarProject.cosumarProject.io;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileRequest  {

    @NotBlank(message = "name should not be empty")
    private String name;
    @NotBlank(message = "name should not be empty")
    private String prenom;

    @Email(message="Enter valid email address")
    @NotBlank(message = "Email should not be empty")
    private String email;



    @Size(min = 6 , message = "Password must be atleast 6 characters")
    private String password;
    // ProfileRequest.java
    private String serviceName;

}
