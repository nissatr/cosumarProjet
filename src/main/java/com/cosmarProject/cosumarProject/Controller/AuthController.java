package com.cosmarProject.cosumarProject.Controller;
import com.cosmarProject.cosumarProject.io.AuthRequest;
import com.cosmarProject.cosumarProject.io.AuthResponse;
import com.cosmarProject.cosumarProject.io.RegisterRequest;
import com.cosmarProject.cosumarProject.io.ResetPasswordRequest;
import com.cosmarProject.cosumarProject.services.EmailService;
import com.cosmarProject.cosumarProject.model.Utilisateur;
import com.cosmarProject.cosumarProject.services.AppUserDetailService;
import com.cosmarProject.cosumarProject.services.ProfileService;
import com.cosmarProject.cosumarProject.services.UtilisateurService;
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
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")

public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailService appUserDetailService;
    private final ProfileService profileService;
    private final UtilisateurService utilisateurService;
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

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Connexion réussie");
                response.put("email", request.getEmail());
                response.put("requiresOtp", false);

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
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Compte vérifié et connexion réussie");
            response.put("email", email);
            
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
}
