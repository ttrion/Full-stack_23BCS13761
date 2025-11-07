package com.portal.academic.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Entity
@Data 
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name; 

    @ManyToMany(mappedBy = "roles")
    private Set<User> users;
}