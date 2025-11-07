package com.portal.academic.Controller;
import com.portal.academic.Entity.Role;
import com.portal.academic.Entity.User;
import com.portal.academic.Payload.loginRequest;
import com.portal.academic.Payload.LoginResponse;
import com.portal.academic.Payload.RegisterRequest;
import com.portal.academic.Payload.MessageResponse;
import com.portal.academic.Repository.RoleRepository;
import com.portal.academic.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody loginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUid(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String jwt = "MOCK_JWT_TOKEN_FOR_" + loginRequest.getUid(); 

        User user = userRepository.findByUid(loginRequest.getUid()).orElseThrow(() -> new RuntimeException("User not found after authentication."));

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new LoginResponse(
                jwt,
                user.getId(),
                user.getUid(),
                user.getFirstName(),
                user.getLastName(),
                roles
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {

        if (userRepository.existsByUid(registerRequest.getUid())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: UID is already taken!"));
        }

        User user = new User();
        user.setUid(registerRequest.getUid());
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new RuntimeException("Error: Role 'ROLE_STUDENT' not found. Ensure initial data load is correct."));
        
        user.setRoles(new HashSet<>(Collections.singletonList(studentRole)));
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully as a student!"));
    }
}