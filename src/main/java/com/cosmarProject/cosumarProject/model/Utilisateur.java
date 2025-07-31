package com.cosmarProject.cosumarProject.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

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
    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp dateCreation;
    @UpdateTimestamp
    private Timestamp dateUpdate;

    @Column(unique=true)
    private String userId;

    @ManyToOne
    @JoinColumn(name = "id_service")
    private ServiceEntity service;

    @ManyToOne
    @JoinColumn(name = "id_role")
    private Role role;

    private String nom;
    private String prenom;
    @Column(unique = true)
    private String email;
    private String motDePasse;
    private String telephone;
    private String verifyOtp;
    private Boolean isAccountVerified;
    private long verifyOtpExpiredAt;
    private String resetOtp;
    private long resetOtpExpiredAt;

}
