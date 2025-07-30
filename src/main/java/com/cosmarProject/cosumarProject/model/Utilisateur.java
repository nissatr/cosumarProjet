package com.cosmarProject.cosumarProject.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue
    private Long id_utilisateur;

    private Boolean estActif;
    private LocalDateTime dateCreation;


    @ManyToOne
    @JoinColumn(name = "id_service")
    private Service service;

    @ManyToOne
    @JoinColumn(name = "id_role")
    private Role role;

    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private String telephone;

}
