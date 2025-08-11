package com.lifegroups.aplicativo.dto.setor; // <-- CAMINHO ATUALIZADO

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;

public record SetorCriarDTO(
    @JsonProperty("name")
    String nome,
    
    @JsonProperty("areaId")
    UUID areaId
) {}