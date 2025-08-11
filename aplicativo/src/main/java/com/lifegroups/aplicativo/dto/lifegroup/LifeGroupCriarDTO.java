package com.lifegroups.aplicativo.dto.lifegroup;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;
public record LifeGroupCriarDTO(@JsonProperty("name") String nome, @JsonProperty("sectorId") UUID setorId) {}