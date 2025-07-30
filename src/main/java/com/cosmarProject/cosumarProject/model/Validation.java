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
@Table(name="validation")
public class Validation {
    @Id
    @GeneratedValue
    private Long id_validation;
    private LocalDateTime dateValidation;
    private String commentaire;
    private String niveau;
    private String statutValidation;

    @ManyToOne
    @JoinColumn(name = "id_demande")
    private Demande demande;

    @ManyToOne
    @JoinColumn(name = "id_validateur")
    private Utilisateur validateur;


}
