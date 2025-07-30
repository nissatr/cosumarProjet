package com.cosmarProject.cosumarProject.Controller;


import com.cosmarProject.cosumarProject.services.RoleService;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }
}
