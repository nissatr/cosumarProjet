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
@Table(name="rapport_it")
public class RapportIT {

    @Id
    @GeneratedValue
    private Long id_rapport_it;
    private LocalDateTime dateRapport;
    private String commentaire;

    @ManyToOne
    @JoinColumn(name = "id_support_it")
    private Utilisateur supportIT;

    @ManyToOne
    @JoinColumn(name = "id_demande")
    private Demande demande;


}
