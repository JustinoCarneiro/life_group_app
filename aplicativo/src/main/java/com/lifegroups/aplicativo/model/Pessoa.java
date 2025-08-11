package com.lifegroups.aplicativo.model;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity @Table(name = "people") @Getter @Setter
public class Pessoa {
    @Id @GeneratedValue(strategy = GenerationType.AUTO) private UUID id;
    @Column(name = "name", nullable = false) private String nome;
    @Column(name = "contact") private String contato;
    @Column(name = "address") private String endereco;
    @Column(name = "birth_date") private LocalDate dataNascimento;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "lifegroup_id") private LifeGroup lifeGroup;
    @Column(name = "is_leader") private boolean ehLider;
    @Column(name = "is_assistant") private boolean ehAuxiliar;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "discipler_id") private Pessoa discipulador;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "steps", columnDefinition = "jsonb") private String passos;
}