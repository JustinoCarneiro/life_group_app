package com.lifegroups.aplicativo.dto.pessoa;

import com.fasterxml.jackson.annotation.JsonFormat; 
import java.time.LocalDate;

public record PessoaAtualizarDTO(
    String nome,
    String contato,
    String endereco,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    LocalDate dataNascimento
) {}