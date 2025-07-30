package com.cosmarProject.cosumarProject.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="type_demande")
public class TypeDemande {
    @Id
    @GeneratedValue
    private Long id_Type;

    private Boolean aDetailType;
    private String nomType;

    @Enumerated(EnumType.STRING)
    private DetailType detailType;

    public enum DetailType {
        NOUVEAU, CHANGEMENT
    }
}
