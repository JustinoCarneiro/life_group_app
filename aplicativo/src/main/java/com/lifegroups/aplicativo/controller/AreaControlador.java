package com.lifegroups.aplicativo.controller;

import com.lifegroups.aplicativo.dto.area.AreaCriarDTO;
import com.lifegroups.aplicativo.dto.area.AreaDTO;
import com.lifegroups.aplicativo.model.Area;
import com.lifegroups.aplicativo.service.AreaServico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/areas")
public class AreaControlador {

    @Autowired
    private AreaServico areaServico;

    private AreaDTO converterParaDTO(Area area) {
        return new AreaDTO(area.getId(), area.getNome());
    }

    @GetMapping
    public List<AreaDTO> listarAreas() {
        return areaServico.buscarTodasAreas()
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public AreaDTO criarArea(@RequestBody AreaCriarDTO dto) {
        Area areaSalva = areaServico.criarArea(dto);
        return converterParaDTO(areaSalva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarArea(@PathVariable UUID id) {
        areaServico.deletarArea(id);
        return ResponseEntity.noContent().build();
    }
}