package com.portal.academic.Payload;

import lombok.Data;
import java.util.List;

@Data
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String uid;
    private String firstName;
    private String lastName;
    private List<String> roles;

    public LoginResponse(String token, Long id, String uid, String firstName, String lastName, List<String> roles) {
        this.token = token;
        this.id = id;
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roles;
    }
}