package com.lifegroups.aplicativo.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Entity @Table(name = "sectors") @Getter @Setter
public class Setor {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @Column(name = "name", nullable = false) private String nome;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "area_id", nullable = false) private Area area;
    @OneToMany(mappedBy = "setor", cascade = CascadeType.ALL, orphanRemoval = true) private List<LifeGroup> lifeGroups;
}