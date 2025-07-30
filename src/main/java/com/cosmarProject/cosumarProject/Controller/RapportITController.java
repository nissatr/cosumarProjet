package com.cosmarProject.cosumarProject.Controller;

import com.cosmarProject.cosumarProject.services.RapportITService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RapportITController {
    private final RapportITService rapportITService;


    public RapportITController(RapportITService rapportITService) {
        this.rapportITService = rapportITService;
    }
}
