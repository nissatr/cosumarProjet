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
@Table(name="demande")
public class Demande {
    @Id
    @GeneratedValue
    private Long id_demande;
    private LocalDateTime dateCreation;
    private String description;

    @ManyToOne
    @JoinColumn(name = "id_demandeur")
    private Utilisateur demandeur;

    @ManyToOne
    @JoinColumn(name = "id_type")
    private TypeDemande typeDemande;

    private String commentaireAutres;
}
