package com.lifegroups.aplicativo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List; // Adicione este import
import java.util.UUID;

@Entity
@Table(name = "sectors")
@Getter
@Setter
public class Sector {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    @OneToMany(mappedBy = "sector", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LifeGroup> lifeGroups;
}