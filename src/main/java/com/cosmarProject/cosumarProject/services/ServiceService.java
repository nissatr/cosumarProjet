package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.repository.ServiceRepository;
import org.springframework.stereotype.Service;

@Service
public class ServiceService {
    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }
}
