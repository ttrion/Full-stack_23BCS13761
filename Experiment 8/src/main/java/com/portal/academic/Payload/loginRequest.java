package com.portal.academic.Payload;

import lombok.Data;

@Data
public class loginRequest {
    private String uid;
    private String password;
}