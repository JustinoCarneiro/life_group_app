package com.lifegroups.aplicativo.controller;

import com.lifegroups.aplicativo.dto.AreaDTO;
import com.lifegroups.aplicativo.dto.SectorDTO;
import com.lifegroups.aplicativo.model.Sector;
import com.lifegroups.aplicativo.repository.SectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/setores")
public class SectorController {

    @Autowired
    private SectorRepository sectorRepository;

    // --- MÉTODOS DE CONVERSÃO ---
    private SectorDTO convertToDTO(Sector sector) {
        AreaDTO areaDTO = new AreaDTO(sector.getArea().getId(), sector.getArea().getName());
        return new SectorDTO(sector.getId(), sector.getName(), areaDTO);
    }

    // --- ENDPOINTS ---
    @GetMapping
    public List<SectorDTO> listarSetores() {
        return sectorRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/por-area/{areaId}")
    public List<SectorDTO> listarSetoresPorArea(@PathVariable UUID areaId) {
        return sectorRepository.findByAreaId(areaId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @PostMapping
    public Sector criarSector(@RequestBody Sector sector) {
        // Para criar, ainda recebemos a Entidade completa para facilitar o save com relacionamentos
        return sectorRepository.save(sector);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SectorDTO> buscarSectorPorId(@PathVariable UUID id) {
        return sectorRepository.findById(id)
                .map(sector -> ResponseEntity.ok(convertToDTO(sector)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Os métodos de PUT e DELETE podem continuar como estavam, pois não retornam o corpo do objeto.
    @PutMapping("/{id}")
    public ResponseEntity<Sector> atualizarSector(@PathVariable UUID id, @RequestBody Sector sectorDetalhes) {
        return sectorRepository.findById(id)
                .map(sectorExistente -> {
                    sectorExistente.setName(sectorDetalhes.getName());
                    sectorExistente.setArea(sectorDetalhes.getArea());
                    Sector sectorAtualizado = sectorRepository.save(sectorExistente);
                    return ResponseEntity.ok(sectorAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarSector(@PathVariable UUID id) {
        if (!sectorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sectorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}