package com.lifegroups.aplicativo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List; // Adicione este import
import java.util.UUID;

@Entity
@Table(name = "areas")
@Getter
@Setter
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "area", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sector> sectors;
}