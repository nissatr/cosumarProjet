package com.cosmarProject.cosumarProject.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="demande")
public class Demande {
    @Id
    @GeneratedValue
    private Long id_demande;
    private LocalDateTime dateCreation;
    private String description;


    @Enumerated(EnumType.STRING)
    private StatutDemande statut;  // EN_COURS, ACCEPTEE, REFUSEE, ANNULEE

    @Enumerated(EnumType.STRING)
    private UrgenceDemande urgence; // FAIBLE, NORMALE, ELEVEE


    @ManyToOne
    @JoinColumn(name = "id_demandeur")
    private Utilisateur demandeur;

    @ManyToOne
    @JoinColumn(name = "id_type")
    private TypeDemande typeDemande;

    private String commentaireAutres;

    @ManyToOne
    @JoinColumn(name = "id_service")
    private ServiceEntity service;



    @Column(name = "approves_by_manager")
    private Boolean approvedByManager = false;

    @Column(name = "managers_approved_list")
    @ElementCollection
    private List<Long> managersApprovedList = new ArrayList<>();

}