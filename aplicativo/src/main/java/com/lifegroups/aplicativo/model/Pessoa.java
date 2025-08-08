package com.lifegroups.aplicativo.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode; // 1. Adicione este import
import org.hibernate.type.SqlTypes;           // 2. Adicione este import

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
    
    // 3. Adicione esta anotação para mapear para o tipo JSONB
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String steps;
}