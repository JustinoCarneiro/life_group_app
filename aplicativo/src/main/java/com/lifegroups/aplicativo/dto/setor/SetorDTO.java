package com.lifegroups.aplicativo.dto.setor;

import com.lifegroups.aplicativo.dto.area.AreaDTO;
import java.util.UUID;

public record SetorDTO(UUID id, String nome, AreaDTO area) {
}