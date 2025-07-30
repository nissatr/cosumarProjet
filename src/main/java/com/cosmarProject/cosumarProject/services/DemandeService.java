package com.cosmarProject.cosumarProject.services;


import com.cosmarProject.cosumarProject.repository.DemandeRepository;
import org.springframework.stereotype.Service;

@Service
public class DemandeService {
    private final DemandeRepository demandeRepository;

    public DemandeService(DemandeRepository demandeRepository) {
        this.demandeRepository = demandeRepository;
    }
}
