package com.lifegroups.aplicativo.dto.pessoa;

import com.fasterxml.jackson.annotation.JsonFormat; // 1. Adicione este import
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

public record PessoaAtualizarDTO(
    @JsonProperty("name")
    String nome,
    @JsonProperty("contact")
    String contato,
    @JsonProperty("address")
    String endereco,
    @JsonProperty("birth_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy") // 2. Adicione esta anotação
    LocalDate dataNascimento
) {}