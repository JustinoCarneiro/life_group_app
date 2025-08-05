package com.lifegroups.sistema.controller;

import com.lifegroups.sistema.model.Sector;
import com.lifegroups.sistema.repository.SectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/setores")
public class SectorController {

    @Autowired
    private SectorRepository sectorRepository;

    @GetMapping
    public List<Sector> listarSetores() {
        return sectorRepository.findAll();
    }

    @PostMapping
    public Sector criarSector(@RequestBody Sector sector) {
        return sectorRepository.save(sector);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sector> buscarSectorPorId(@PathVariable UUID id) {
        return sectorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Sector> atualizarSector(@PathVariable UUID id, @RequestBody Sector sectorDetalhes) {
        return sectorRepository.findById(id)
                .map(sectorExistente -> {
                    sectorExistente.setName(sectorDetalhes.getName());
                    sectorExistente.setArea(sectorDetalhes.getArea()); // Permite alterar a área do setor
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