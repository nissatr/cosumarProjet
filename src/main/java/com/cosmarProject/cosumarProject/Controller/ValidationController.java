package com.cosmarProject.cosumarProject.Controller;

import com.cosmarProject.cosumarProject.services.ValidationService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ValidationController {

    private final ValidationService validationService;

    public ValidationController(ValidationService validationService) {
        this.validationService = validationService;
    }
}
