package com.lifegroups.aplicativo.dto;

import java.util.UUID;

// Usamos um SectorDTO simplificado aqui, sem a sua Área
public record LifeGroupDTO(UUID id, String name, SectorDTO sector) {
}