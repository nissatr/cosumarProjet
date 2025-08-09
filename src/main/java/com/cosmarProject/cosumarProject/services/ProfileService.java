package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.io.ProfileRequest;
import com.cosmarProject.cosumarProject.io.ProfileResponse;

public interface ProfileService  {

    ProfileResponse createProfile(ProfileRequest request);

    ProfileResponse getProfile(String email);

    void sendReset0tp(String email);

    void resetPassword(String email, String otp , String newPassword);

    void sendOtp(String email);
    void  verifyOtp(String email, String otp);

    String getLoggedInUserId(String email);


}
