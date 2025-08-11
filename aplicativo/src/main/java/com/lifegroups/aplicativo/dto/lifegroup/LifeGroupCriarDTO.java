package com.lifegroups.aplicativo.dto.lifegroup; // <-- CAMINHO ATUALIZADO

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;

public record LifeGroupCriarDTO(
    @JsonProperty("name")
    String nome,

    @JsonProperty("sectorId") // Assumindo que o front-end envia sectorId
    UUID setorId
) {}