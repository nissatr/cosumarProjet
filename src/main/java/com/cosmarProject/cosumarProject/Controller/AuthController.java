package com.cosmarProject.cosumarProject.Controller;
import com.cosmarProject.cosumarProject.io.AuthRequest;
import com.cosmarProject.cosumarProject.io.AuthResponse;
import com.cosmarProject.cosumarProject.io.RegisterRequest;
import com.cosmarProject.cosumarProject.io.ResetPasswordRequest;
import com.cosmarProject.cosumarProject.services.EmailService;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import com.cosmarProject.cosumarProject.model.Role;
import com.cosmarProject.cosumarProject.services.AppUserDetailService;
import com.cosmarProject.cosumarProject.services.ProfileService;
import com.cosmarProject.cosumarProject.services.UtilisateurService;
import com.cosmarProject.cosumarProject.services.RoleService;
import com.cosmarProject.cosumarProject.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")

public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailService appUserDetailService;
    private final ProfileService profileService;
    private final UtilisateurService utilisateurService;
    private final RoleService roleService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is running!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            Utilisateur newUser = utilisateurService.createUser(request);
            
            // Envoyer un email de bienvenue
            try {
                String fullName = newUser.getPrenom() + " " + newUser.getNom();
                emailService.sendWelcomeEmail(newUser.getEmail(), fullName);
            } catch (Exception e) {
                System.out.println("Erreur lors de l'envoi de l'email de bienvenue: " + e.getMessage());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Compte créé avec succès. Un email de bienvenue a été envoyé.");
            response.put("userId", newUser.getId_utilisateur());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(error);
        }
    }

        @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            System.out.println("Tentative d'authentification de : " + request.getEmail());
            authenticate(request.getEmail(), request.getPassword());
            System.out.println("Authentification OK");

            // Vérifier si l'utilisateur est déjà vérifié
            Utilisateur utilisateur = utilisateurService.findByEmail(request.getEmail());
            
            if (utilisateur.getIsAccountVerified() == null || !utilisateur.getIsAccountVerified()) {
                // Première connexion - envoyer OTP
                try {
                    emailService.sendLoginOtp(request.getEmail());
                } catch (Exception e) {
                    System.out.println("Erreur lors de l'envoi de l'OTP: " + e.getMessage());
                }

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Vérification OTP requise pour la première connexion");
                response.put("email", request.getEmail());
                response.put("requiresOtp", true);
                response.put("isFirstLogin", true);

                return ResponseEntity.ok(response);
            } else {
                // Utilisateur déjà vérifié - connexion directe
                final UserDetails userDetails = appUserDetailService.loadUserByUsername(request.getEmail());
                final String jwtToken = jwtUtil.generateToken(userDetails);

                ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                        .httpOnly(true)
                        .path("/")
                        .maxAge(Duration.ofDays(1))
                        .sameSite("strict")
                        .build();

                // Envoyer une notification de connexion réussie
                try {
                    emailService.sendLoginNotification(request.getEmail(), userDetails.getUsername());
                } catch (Exception e) {
                    System.out.println("Erreur lors de l'envoi de la notification: " + e.getMessage());
                }

                // Récupérer les informations complètes de l'utilisateur
                Utilisateur utilisateurComplet = utilisateurService.findByEmail(request.getEmail());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Connexion réussie");
                response.put("email", request.getEmail());
                response.put("requiresOtp", false);
                
                // Ajouter les informations de l'utilisateur pour la redirection
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", utilisateurComplet.getId_utilisateur());
                userInfo.put("email", utilisateurComplet.getEmail());
                userInfo.put("nom", utilisateurComplet.getNom());
                userInfo.put("prenom", utilisateurComplet.getPrenom());
                userInfo.put("role", utilisateurComplet.getRole() != null ? utilisateurComplet.getRole().getNom() : null);
                userInfo.put("service", utilisateurComplet.getService() != null ? utilisateurComplet.getService().getNom() : null);
                response.put("user", userInfo);

                return ResponseEntity.ok()
                        .header(HttpHeaders.SET_COOKIE, cookie.toString())
                        .body(response);
            }

        } catch (BadCredentialsException e) {
            System.out.println("BadCredentialsException");
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Email or password is incorrect");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (DisabledException ex) {
            System.out.println("DisabledException");
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Account is disabled");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception ex) {
            ex.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("error", true);
            error.put("message", "Authentification failed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
    public void authenticate (String email, String password){
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    @GetMapping("/is-authentificated")
    public ResponseEntity<Boolean> isAuthenticated(@CurrentSecurityContext(expression = "authentication?.name") String email){
        return ResponseEntity.ok(email != null);
    }

    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@CurrentSecurityContext(expression = "authentication?.name") String email){
        try {
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Non authentifié");
            }
            
            Utilisateur utilisateur = utilisateurService.findByEmail(email);
            if (utilisateur == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé");
            }
            
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", utilisateur.getId_utilisateur());
            userInfo.put("nom", utilisateur.getNom());
            userInfo.put("prenom", utilisateur.getPrenom());
            userInfo.put("email", utilisateur.getEmail());
            userInfo.put("telephone", utilisateur.getTelephone());
            userInfo.put("service", utilisateur.getService() != null ? utilisateur.getService().getNom() : "");
            userInfo.put("role", utilisateur.getRole() != null ? utilisateur.getRole().getNom() : "");
            
            return ResponseEntity.ok(userInfo);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la récupération des informations");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            // Créer un cookie vide pour supprimer le JWT
            ResponseCookie cookie = ResponseCookie.from("jwt", "")
                    .httpOnly(true)
                    .path("/")
                    .maxAge(0) // Expire immédiatement
                    .sameSite("strict")
                    .build();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Déconnexion réussie");

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
                    
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur lors de la déconnexion");
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Endpoints pour Super Admin
    @GetMapping("/admin/users")
    public ResponseEntity<?> getAllUsers(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        try {
            // Vérifier si l'utilisateur est super admin
            Utilisateur currentUser = utilisateurService.findByEmail(email);
            if (currentUser.getRole() == null || !"SUPER_ADMIN".equals(currentUser.getRole().getNom())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès refusé - Super Admin requis");
            }

            List<Utilisateur> users = utilisateurService.getAllUsers();
            List<Map<String, Object>> userList = new ArrayList<>();
            
            for (Utilisateur user : users) {
                Map<String, Object> userInfo = new HashMap<>();
                userInfo.put("id", user.getId_utilisateur());
                userInfo.put("nom", user.getNom());
                userInfo.put("prenom", user.getPrenom());
                userInfo.put("email", user.getEmail());
                userInfo.put("telephone", user.getTelephone());
                userInfo.put("service", user.getService() != null ? user.getService().getNom() : "");
                userInfo.put("role", user.getRole() != null ? user.getRole().getNom() : "");
                userInfo.put("estActif", user.getEstActif());
                userInfo.put("isAccountVerified", user.getIsAccountVerified());
                userInfo.put("dateCreation", user.getDateCreation());
                
                userList.add(userInfo);
            }
            
            return ResponseEntity.ok(userList);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la récupération des utilisateurs");
        }
    }

    @GetMapping("/admin/roles")
    public ResponseEntity<?> getAllRoles(@CurrentSecurityContext(expression = "authentication?.name") String email) {
        try {
            // Vérifier si l'utilisateur est super admin
            Utilisateur currentUser = utilisateurService.findByEmail(email);
            if (currentUser.getRole() == null || !"SUPER_ADMIN".equals(currentUser.getRole().getNom())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès refusé - Super Admin requis");
            }

            List<Role> roles = roleService.getAllRoles();
            return ResponseEntity.ok(roles);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la récupération des rôles");
        }
    }

    @PutMapping("/admin/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request,
            @CurrentSecurityContext(expression = "authentication?.name") String email) {
        try {
            System.out.println("🔄 Tentative de modification du rôle - UserID: " + userId + ", Email: " + email);
            System.out.println("📝 Données reçues: " + request);
            
            // Vérifier si l'utilisateur est super admin
            Utilisateur currentUser = utilisateurService.findByEmail(email);
            if (currentUser.getRole() == null || !"SUPER_ADMIN".equals(currentUser.getRole().getNom())) {
                System.out.println("❌ Accès refusé - Utilisateur n'est pas Super Admin");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Accès refusé - Super Admin requis");
            }

            String newRoleName = (String) request.get("role");
            if (newRoleName == null || newRoleName.trim().isEmpty()) {
                System.out.println("❌ Nom du rôle manquant");
                return ResponseEntity.badRequest().body("Le nom du rôle est requis");
            }

            System.out.println("✅ Tentative de mise à jour - UserID: " + userId + ", Nouveau rôle: " + newRoleName);
            Utilisateur updatedUser = utilisateurService.updateUserRole(userId, newRoleName);
            System.out.println("✅ Utilisateur mis à jour avec succès: " + updatedUser.getEmail() + " - Rôle: " + updatedUser.getRole().getNom());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Rôle mis à jour avec succès");
            response.put("user", updatedUser);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la mise à jour: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur lors de la mise à jour du rôle: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Endpoint pour créer le premier Super Admin (à utiliser une seule fois)
    @PostMapping("/init-super-admin")
    public ResponseEntity<?> initSuperAdmin(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String password = (String) request.get("password");
            
            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email et mot de passe requis");
            }

            // Vérifier si un super admin existe déjà
            if (utilisateurService.superAdminExists()) {
                return ResponseEntity.badRequest().body("Un Super Admin existe déjà");
            }

            // Créer le super admin
            Utilisateur superAdmin = utilisateurService.createSuperAdmin(email, password);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Super Admin créé avec succès");
            response.put("email", superAdmin.getEmail());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur lors de la création du Super Admin: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Endpoint pour initialiser les rôles de base
    @PostMapping("/init-roles")
    public ResponseEntity<?> initRoles() {
        try {
            List<String> baseRoles = Arrays.asList("SUPER_ADMIN", "ADMIN", "UTILISATEUR", "demandeur");
            List<Role> createdRoles = new ArrayList<>();
            
            for (String roleName : baseRoles) {
                try {
                    Role role = roleService.createRole(roleName);
                    createdRoles.add(role);
                } catch (Exception e) {
                    // Le rôle existe déjà, on continue
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Rôles initialisés avec succès");
            response.put("roles", createdRoles);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur lors de l'initialisation des rôles: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/send-reset-otp")
    public void sendResetOtp(@RequestParam String email){
        try{
            profileService.sendReset0tp(email);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR , e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request){
        try{
            profileService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR , e.getMessage());
        }
    }

    @PostMapping("/send-otp")
    public void sendVerifyOtp(@CurrentSecurityContext(expression = "authentication?.name") String email){
        try{
            profileService.sendOtp(email);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR , e.getMessage());
        }
    }

    @PostMapping("/verify-otp")
    public void verifyEmail(@RequestBody Map<String,Object> request,
                           @CurrentSecurityContext(expression = "authentication?.name") String email){
        try{
            String otp = (String) request.get("otp");
            profileService.verifyOtp(email, otp);
        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR , e.getMessage());
        }
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<?> verifyLoginOtp(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String otp = (String) request.get("otp");
            
            // Vérifier l'OTP
            if (!emailService.verifyLoginOtp(email, otp)) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Code OTP invalide");
                return ResponseEntity.badRequest().body(error);
            }

            // Marquer le compte comme vérifié
            Utilisateur utilisateur = utilisateurService.findByEmail(email);
            utilisateur.setIsAccountVerified(true);
            utilisateurService.updateUser(utilisateur);
            
            final UserDetails userDetails = appUserDetailService.loadUserByUsername(email);
            final String jwtToken = jwtUtil.generateToken(userDetails);
            
            ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .sameSite("strict")
                    .build();
            
            // Envoyer une notification de connexion réussie
            try {
                emailService.sendLoginNotification(email, userDetails.getUsername());
            } catch (Exception e) {
                System.out.println("Erreur lors de l'envoi de la notification: " + e.getMessage());
            }
            
            // Récupérer les informations complètes de l'utilisateur
            Utilisateur utilisateurComplet = utilisateurService.findByEmail(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Compte vérifié et connexion réussie");
            response.put("email", email);
            
            // Ajouter les informations de l'utilisateur pour la redirection
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", utilisateurComplet.getId_utilisateur());
            userInfo.put("email", utilisateurComplet.getEmail());
            userInfo.put("nom", utilisateurComplet.getNom());
            userInfo.put("prenom", utilisateurComplet.getPrenom());
            userInfo.put("role", utilisateurComplet.getRole() != null ? utilisateurComplet.getRole().getNom() : null);
            userInfo.put("service", utilisateurComplet.getService() != null ? utilisateurComplet.getService().getNom() : null);
            response.put("user", userInfo);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
                    
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur lors de la vérification");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/admin/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, Object> request) {
        try {
            System.out.println("🔄 Tentative de création d'utilisateur par Super Admin");
            
            // Extraire les données de la requête
            String email = (String) request.get("email");
            String password = (String) request.get("password");
            String nom = (String) request.get("nom");
            String prenom = (String) request.get("prenom");
            String telephone = (String) request.get("telephone");
            String roleName = (String) request.get("role");
            String serviceName = (String) request.get("service");
            
            System.out.println("📝 Données reçues: " + request);
            
            // Créer l'utilisateur
            Utilisateur newUser = utilisateurService.createUserByAdmin(email, password, nom, prenom, telephone, roleName, serviceName);
            
            // Envoyer un email de bienvenue
            try {
                String fullName = prenom + " " + nom;
                emailService.sendWelcomeEmail(email, fullName);
            } catch (Exception e) {
                System.out.println("⚠️ Erreur lors de l'envoi de l'email de bienvenue: " + e.getMessage());
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Utilisateur créé avec succès");
            response.put("userId", newUser.getId_utilisateur());
            
            System.out.println("✅ Utilisateur créé avec succès: " + newUser.getId_utilisateur());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la création de l'utilisateur: " + e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/admin/users/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @RequestBody Map<String, Object> request) {
        try {
            System.out.println("🔄 Tentative de mise à jour de l'utilisateur ID: " + userId);
            
            // Extraire les données de la requête
            String email = (String) request.get("email");
            String nom = (String) request.get("nom");
            String prenom = (String) request.get("prenom");
            String telephone = (String) request.get("telephone");
            String roleName = (String) request.get("role");
            String serviceName = (String) request.get("service");
            
            System.out.println("📝 Données reçues: " + request);
            
            // Mettre à jour l'utilisateur
            Utilisateur updatedUser = utilisateurService.updateUserByAdmin(userId, email, nom, prenom, telephone, roleName, serviceName);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Utilisateur mis à jour avec succès");
            response.put("userId", updatedUser.getId_utilisateur());
            
            System.out.println("✅ Utilisateur mis à jour avec succès: " + updatedUser.getId_utilisateur());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la mise à jour de l'utilisateur: " + e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/admin/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            System.out.println("🔄 Tentative de suppression de l'utilisateur ID: " + userId);
            
            // Supprimer l'utilisateur
            utilisateurService.deleteUserByAdmin(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Utilisateur supprimé avec succès");
            
            System.out.println("✅ Utilisateur supprimé avec succès: " + userId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("❌ Erreur lors de la suppression de l'utilisateur: " + e.getMessage());
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
