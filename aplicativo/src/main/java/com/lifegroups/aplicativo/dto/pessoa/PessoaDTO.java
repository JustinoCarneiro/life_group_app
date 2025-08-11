package com.lifegroups.aplicativo.dto.pessoa;
import java.time.LocalDate;
import java.util.UUID;
public record PessoaDTO(UUID id, String nome, String contato, String endereco, LocalDate dataNascimento, UUID idLifeGroup, boolean ehLider, boolean ehAuxiliar, UUID idDiscipulador, String passos) {}