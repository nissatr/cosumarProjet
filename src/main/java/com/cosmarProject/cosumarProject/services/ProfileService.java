package com.cosmarProject.cosumarProject.services;

import com.cosmarProject.cosumarProject.io.ProfileRequest;
import com.cosmarProject.cosumarProject.io.ProfileResponse;

public interface ProfileService  {

    ProfileResponse createProfile(ProfileRequest request);


}
