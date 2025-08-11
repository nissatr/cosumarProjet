package com.cosmarProject.cosumarProject.services;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    public void sendWelcomeEmail(String toEmail , String name){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("welcome to our platfrom");
        message.setText("hello" + name +" , \n\n thanks for  registring us");
        mailSender.send(message);

    }
    public void sendResetOtpEmail(String toEmail, String otp){

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP for resetting password is " +otp+" . Use this OTP to proceed with resetting your password");
        mailSender.send(message);
    }
    public void sendOtpEmail(String toEmail, String otp){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Account verification OTP");
        message.setText("Your OTP is"+otp+" . Verify your account using this OTP");
        mailSender.send(message);
    }

    public void sendLoginNotification(String toEmail, String username){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Nouvelle connexion détectée");
        message.setText("Bonjour " + username + ",\n\n" +
                "Une nouvelle connexion a été détectée sur votre compte.\n" +
                "Si ce n'était pas vous, veuillez contacter l'administrateur.\n\n" +
                "Cordialement,\nL'équipe Cosumar");
        mailSender.send(message);
    }

    private final Map<String, String> otpStorage = new HashMap<>();

    public void sendLoginOtp(String toEmail){
        // Générer un OTP à 6 chiffres
        String otp = String.format("%06d", (int)(Math.random() * 1000000));
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Code de vérification de connexion");
        message.setText("Votre code de vérification pour la connexion est : " + otp + "\n\nCe code expire dans 10 minutes.");
        mailSender.send(message);
        
        // Stocker l'OTP temporairement
        otpStorage.put(toEmail, otp);
        System.out.println("OTP généré pour " + toEmail + ": " + otp);
    }

    public boolean verifyLoginOtp(String email, String otp) {
        String storedOtp = otpStorage.get(email);
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(email); // Supprimer l'OTP après utilisation
            return true;
        }
        return false;
    }

}
