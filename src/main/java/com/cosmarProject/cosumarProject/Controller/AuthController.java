package com.cosmarProject.cosumarProject.Controller;
import com.cosmarProject.cosumarProject.io.AuthRequest;
import com.cosmarProject.cosumarProject.io.AuthResponse;
import com.cosmarProject.cosumarProject.io.ResetPasswordRequest;
import com.cosmarProject.cosumarProject.services.AppUserDetailService;
import com.cosmarProject.cosumarProject.services.ProfileService;
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

public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AppUserDetailService appUserDetailService;
    private final ProfileService profileService;

    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            System.out.println("Tentative d'authentification de : " + request.getEmail());
            authenticate(request.getEmail(), request.getPassword());
            System.out.println("Authentification OK");
            final UserDetails userDetails =appUserDetailService.loadUserByUsername(request.getEmail());
            System.out.println("Chargement UserDetails OK");
            final String jwtToken = jwtUtil.generateToken(userDetails);
            System.out.println("JWT généré : " + jwtToken);

            ResponseCookie cookie=  ResponseCookie.from("jwt", jwtToken)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofDays(1))
                    .sameSite("strict")
                    .build();
            System.out.println("Préparation de la réponse");

            return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE , cookie.toString()).body(new AuthResponse(request.getEmail() , jwtToken));
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
        if(request.get("otp").toString() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST ,  "Missing Details");
        }


        try{
            profileService.verifyOtp(email, request.get("otp").toString());

        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR , e.getMessage());
        }


    }


}
