package com.cosmarProject.cosumarProject.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name="service")
public class Service {
    @Id
    @GeneratedValue
    private Long id_service;

    private String nom;



}
