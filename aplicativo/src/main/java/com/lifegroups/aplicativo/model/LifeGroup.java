package com.lifegroups.aplicativo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List; // Adicione este import
import java.util.UUID;

@Entity
@Table(name = "lifegroups")
@Getter
@Setter
public class LifeGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sector_id", nullable = false)
    private Sector sector;

    @OneToMany(mappedBy = "lifegroup", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Pessoa> people;
}