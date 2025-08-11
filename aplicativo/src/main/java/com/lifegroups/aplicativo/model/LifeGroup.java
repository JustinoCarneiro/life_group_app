package com.lifegroups.aplicativo.model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Entity @Table(name = "lifegroups") @Getter @Setter
public class LifeGroup {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @Column(name = "name", nullable = false) private String nome;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "sector_id", nullable = false) private Setor setor;
    @OneToMany(mappedBy = "lifeGroup", cascade = CascadeType.ALL, orphanRemoval = true) private List<Pessoa> pessoas;
}