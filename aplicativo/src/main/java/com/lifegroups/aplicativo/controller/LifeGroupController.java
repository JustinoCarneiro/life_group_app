package com.lifegroups.aplicativo.controller;

import com.lifegroups.aplicativo.dto.AreaDTO;
import com.lifegroups.aplicativo.dto.LifeGroupDTO;
import com.lifegroups.aplicativo.dto.SectorDTO;
import com.lifegroups.aplicativo.model.LifeGroup;
import com.lifegroups.aplicativo.repository.LifeGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/lifegroups")
public class LifeGroupController {

    @Autowired
    private LifeGroupRepository lifeGroupRepository;

    /**
     * Converte uma entidade LifeGroup para o seu DTO correspondente.
     * Este método é crucial para evitar erros de serialização JSON com lazy loading.
     */
    private LifeGroupDTO convertToDTO(LifeGroup lifegroup) {
        AreaDTO areaDTO = new AreaDTO(
            lifegroup.getSector().getArea().getId(),
            lifegroup.getSector().getArea().getName()
        );
        SectorDTO sectorDTO = new SectorDTO(
            lifegroup.getSector().getId(),
            lifegroup.getSector().getName(),
            areaDTO
        );
        return new LifeGroupDTO(
            lifegroup.getId(),
            lifegroup.getName(),
            sectorDTO
        );
    }

    @GetMapping
    public List<LifeGroupDTO> listarLifegroups() {
        return lifeGroupRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/por-setor/{sectorId}")
    public List<LifeGroupDTO> listarLifegroupsPorSetor(@PathVariable UUID sectorId) {
        return lifeGroupRepository.findBySectorId(sectorId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LifeGroupDTO> buscarLifeGroupPorId(@PathVariable UUID id) {
        return lifeGroupRepository.findById(id)
                .map(lifegroup -> ResponseEntity.ok(convertToDTO(lifegroup)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public LifeGroup criarLifeGroup(@RequestBody LifeGroup lifegroup) {
        // Para criar, recebemos a Entidade completa para facilitar o save com relacionamentos
        return lifeGroupRepository.save(lifegroup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LifeGroup> atualizarLifeGroup(@PathVariable UUID id, @RequestBody LifeGroup lifegroupDetalhes) {
        return lifeGroupRepository.findById(id)
                .map(lifegroupExistente -> {
                    lifegroupExistente.setName(lifegroupDetalhes.getName());
                    lifegroupExistente.setSector(lifegroupDetalhes.getSector());
                    LifeGroup lifegroupAtualizado = lifeGroupRepository.save(lifegroupExistente);
                    return ResponseEntity.ok(lifegroupAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLifeGroup(@PathVariable UUID id) {
        if (!lifeGroupRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        lifeGroupRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}