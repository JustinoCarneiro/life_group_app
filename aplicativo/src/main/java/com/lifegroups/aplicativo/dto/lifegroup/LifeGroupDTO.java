package com.lifegroups.aplicativo.dto.lifegroup;

import com.lifegroups.aplicativo.dto.setor.SetorDTO;
import java.util.UUID;

public record LifeGroupDTO(UUID id, String nome, SetorDTO setor) {
}