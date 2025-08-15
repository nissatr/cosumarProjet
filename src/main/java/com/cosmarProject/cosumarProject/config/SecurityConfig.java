package com.cosmarProject.cosumarProject.config;

import com.cosmarProject.cosumarProject.filter.JwtRequestFilter;
import com.cosmarProject.cosumarProject.services.AppUserDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configurers.userdetails.DaoAuthenticationConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor

public class SecurityConfig {

    private final AppUserDetailService appUserDetailService;
    private final JwtRequestFilter jwtRequestFilter;

    private final CustomAuthentificationEntryPoint customAuthentificationEntryPoint;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtRequestFilter jwtRequestFilter) throws Exception {
        http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable) // Pour les APIs REST
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/register", "/api/v1.0/register", "/login", "/api/v1.0/login", "/verify-login-otp", "/api/v1.0/verify-login-otp", "/send-reset-otp", "/reset-password", "/logout", "/api/v1.0/logout", "/init-super-admin", "/api/v1.0/init-super-admin", "/init-roles", "/api/v1.0/init-roles", "/type-demandes", "/api/v1.0/type-demandes", "/type-demandes/delete-all", "/api/v1.0/type-demandes/delete-all", "/type-demandes/create", "/api/v1.0/type-demandes/create", "/delete-all-demands", "/api/v1.0/delete-all-demands", "/cleanup-invalid-demands", "/api/v1.0/cleanup-invalid-demands", "/mes-demandes", "/api/v1.0/mes-demandes", "/demandes/mes-demandes-service", "/api/v1.0/demandes/mes-demandes-service", "/demandes/support-it", "/api/v1.0/demandes/support-it", "/demandes/*/approve", "/api/v1.0/demandes/*/approve", "/demandes/*/reject", "/api/v1.0/demandes/*/reject", "/demandes/*/rapport-it/download", "/api/v1.0/demandes/*/rapport-it/download", "/equipment", "/api/v1.0/equipment", "/test").permitAll() // Autorise l'accès
                        .anyRequest().authenticated() // Tout le reste est protégé
                )
                .sessionManagement(session ->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .logout(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtRequestFilter , UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(ex -> ex.authenticationEntryPoint(customAuthentificationEntryPoint));


        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsFilter corsFilter(){
        return new CorsFilter(corsConfigurationSource());
    }




    private CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager() throws Exception {
        DaoAuthenticationProvider authentificationProvider = new DaoAuthenticationProvider();
        authentificationProvider.setUserDetailsService(appUserDetailService);
        authentificationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authentificationProvider);
    }


}