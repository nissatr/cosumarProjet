package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.repository.TypeDemandeRepository;
import org.springframework.stereotype.Service;

@Service
public class TypeDemandeService {

    private final TypeDemandeRepository typeDemandeRepository;

    public TypeDemandeService(TypeDemandeRepository typeDemandeRepository) {
        this.typeDemandeRepository = typeDemandeRepository;
    }
}
