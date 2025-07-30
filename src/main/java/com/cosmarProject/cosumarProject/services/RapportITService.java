package com.cosmarProject.cosumarProject.services;


import com.cosmarProject.cosumarProject.repository.RapportITRepository;
import org.springframework.stereotype.Service;

@Service
public class RapportITService {
    private final RapportITRepository rapportITRepository;

    public RapportITService(RapportITRepository rapportITRepository) {
        this.rapportITRepository = rapportITRepository;
    }
}
