package com.lifegroups.aplicativo.controller;

import com.lifegroups.aplicativo.model.Area;
import com.lifegroups.aplicativo.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/areas")
public class AreaController {

    @Autowired
    private AreaRepository areaRepository;

    @GetMapping
    public List<Area> listarAreas() {
        return areaRepository.findAll();
    }

    @PostMapping
    public Area criarArea(@RequestBody Area area) {
        return areaRepository.save(area);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Area> buscarAreaPorId(@PathVariable UUID id) {
        return areaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

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