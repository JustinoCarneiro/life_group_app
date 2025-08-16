package com.lifegroups.aplicativo.dto.pessoa;

import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.util.UUID;

public record PessoaCriarDTO(
    String nome,
    String contato,
    String endereco,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
    LocalDate dataNascimento,
    UUID idLifeGroup
) {}