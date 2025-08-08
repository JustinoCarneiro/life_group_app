package com.lifegroups.aplicativo.dto;

import java.time.LocalDate;
import java.util.UUID;

public record PessoaDTO(
    UUID id,
    String name,
    String contact,
    String address,
    LocalDate birth_date,
    UUID lifegroupId,
    boolean is_leader,
    boolean is_assistant,
    UUID disciplerId,
    String steps
) {}