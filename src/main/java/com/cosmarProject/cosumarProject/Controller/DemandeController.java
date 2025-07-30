package com.cosmarProject.cosumarProject.Controller;

import com.cosmarProject.cosumarProject.services.DemandeService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemandeController {
    private final DemandeService demandeService;

    public DemandeController(DemandeService demandeService) {
        this.demandeService = demandeService;
    }
}
