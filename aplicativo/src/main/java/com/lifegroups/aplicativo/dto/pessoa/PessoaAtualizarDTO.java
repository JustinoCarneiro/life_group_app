package com.lifegroups.aplicativo.dto.pessoa;

import java.time.LocalDate;

public record PessoaAtualizarDTO(
    String nome,
    String contato,
    String endereco,
    LocalDate dataNascimento
) {}