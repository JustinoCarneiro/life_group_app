package com.lifegroups.aplicativo.controller;

import com.lifegroups.aplicativo.dto.area.AreaDTO;
import com.lifegroups.aplicativo.dto.lifegroup.LifeGroupCriarDTO;
import com.lifegroups.aplicativo.dto.lifegroup.LifeGroupDTO;
import com.lifegroups.aplicativo.dto.setor.SetorDTO;
import com.lifegroups.aplicativo.model.LifeGroup;
import com.lifegroups.aplicativo.service.LifeGroupServico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lifegroups")
public class LifeGroupControlador {

    @Autowired
    private LifeGroupServico lifeGroupServico;
    
    private LifeGroupDTO converterParaDTO(LifeGroup lifeGroup) {
        AreaDTO areaDTO = new AreaDTO(lifeGroup.getSetor().getArea().getId(), lifeGroup.getSetor().getArea().getNome());
        SetorDTO setorDTO = new SetorDTO(lifeGroup.getSetor().getId(), lifeGroup.getSetor().getNome(), areaDTO);
        return new LifeGroupDTO(lifeGroup.getId(), lifeGroup.getNome(), setorDTO);
    }
    
    @GetMapping("/por-setor/{idSetor}")
    public List<LifeGroupDTO> listarLifeGroupsPorSetor(@PathVariable UUID idSetor) {
        return lifeGroupServico.buscarLifeGroupsPorSetor(idSetor)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public LifeGroupDTO criarLifeGroup(@RequestBody LifeGroupCriarDTO dto) {
        LifeGroup lifeGroupSalvo = lifeGroupServico.criarLifeGroup(dto);
        return converterParaDTO(lifeGroupSalvo);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLifeGroup(@PathVariable UUID id) {
        lifeGroupServico.deletarLifeGroup(id);
        return ResponseEntity.noContent().build();
    }
}