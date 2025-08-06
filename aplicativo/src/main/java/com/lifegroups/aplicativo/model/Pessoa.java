package com.lifegroups.aplicativo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "people")
@Getter
@Setter
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String contact;
    private String address;
    private LocalDate birth_date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lifegroup_id")
    private LifeGroup lifegroup;

    private boolean is_leader;
    private boolean is_assistant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discipler_id")
    private Pessoa discipler;

    // O campo 'steps' (JSONB) pode ser mapeado como uma String
    // ou com uma biblioteca de conversão de JSON se precisar de manipulação complexa.
    @Column(columnDefinition = "jsonb")
    private String steps;
}