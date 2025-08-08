package com.lifegroups.aplicativo.controller;

import com.lifegroups.aplicativo.dto.AreaDTO;
import com.lifegroups.aplicativo.model.Area;
import com.lifegroups.aplicativo.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/areas")
public class AreaController {

    @Autowired
    private AreaRepository areaRepository;

    private AreaDTO convertToDTO(Area area) {
        return new AreaDTO(area.getId(), area.getName());
    }

    @GetMapping
    public List<AreaDTO> listarAreas() {
        return areaRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public Area criarArea(@RequestBody Area area) {
        return areaRepository.save(area);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AreaDTO> buscarAreaPorId(@PathVariable UUID id) {
        return areaRepository.findById(id)
                .map(area -> ResponseEntity.ok(convertToDTO(area)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // PUT e DELETE continuam iguais
    @PutMapping("/{id}")
    public ResponseEntity<Area> atualizarArea(@PathVariable UUID id, @RequestBody Area areaDetalhes) {
        return areaRepository.findById(id)
                .map(areaExistente -> {
                    areaExistente.setName(areaDetalhes.getName());
                    Area areaAtualizada = areaRepository.save(areaExistente);
                    return ResponseEntity.ok(areaAtualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarArea(@PathVariable UUID id) {
        if (!areaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        areaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}