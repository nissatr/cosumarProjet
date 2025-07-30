package com.cosmarProject.cosumarProject.Controller;


import com.cosmarProject.cosumarProject.services.ServiceService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ServiceController {
    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }
}
