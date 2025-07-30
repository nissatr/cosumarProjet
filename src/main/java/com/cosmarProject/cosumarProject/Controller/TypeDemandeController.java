package com.cosmarProject.cosumarProject.Controller;


import com.cosmarProject.cosumarProject.services.TypeDemandeService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TypeDemandeController {

    private final TypeDemandeService typeDemandeService;

    public TypeDemandeController(TypeDemandeService typeDemandeService) {
        this.typeDemandeService = typeDemandeService;
    }
}
