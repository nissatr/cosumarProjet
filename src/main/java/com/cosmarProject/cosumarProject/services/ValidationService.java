package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.repository.ValidationRepository;
import org.springframework.stereotype.Service;

@Service
public class ValidationService {
    private final ValidationRepository validationRepository;

    public ValidationService(ValidationRepository validationRepository) {
        this.validationRepository = validationRepository;
    }
}
