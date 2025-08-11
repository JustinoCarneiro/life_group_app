package com.lifegroups.aplicativo.dto.area;
import com.fasterxml.jackson.annotation.JsonProperty;

public record AreaCriarDTO(
    @JsonProperty("name")
    String nome
) {}