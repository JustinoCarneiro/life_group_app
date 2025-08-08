package com.lifegroups.aplicativo.dto;

import java.util.UUID;

public record SectorDTO(UUID id, String name, AreaDTO area) {
}