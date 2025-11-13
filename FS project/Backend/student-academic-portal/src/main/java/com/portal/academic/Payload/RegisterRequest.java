package com.portal.academic.Payload;

import lombok.Data;

@Data
public class RegisterRequest {
    private String uid;
    private String password;
    private String firstName;
    private String lastName;
}