package com.lifegroups.sistema.controller;

import com.lifegroups.sistema.model.Lifegroup;
import com.lifegroups.sistema.repository.LifegroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lifegroups")
public class LifegroupController {

    @Autowired
    private LifegroupRepository lifegroupRepository;

    @GetMapping
    public List<Lifegroup> listarLifegroups() {
        return lifegroupRepository.findAll();
    }

    @PostMapping
    public Lifegroup criarLifegroup(@RequestBody Lifegroup lifegroup) {
        return lifegroupRepository.save(lifegroup);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lifegroup> buscarLifegroupPorId(@PathVariable UUID id) {
        return lifegroupRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lifegroup> atualizarLifegroup(@PathVariable UUID id, @RequestBody Lifegroup lifegroupDetalhes) {
        return lifegroupRepository.findById(id)
                .map(lifegroupExistente -> {
                    lifegroupExistente.setName(lifegroupDetalhes.getName());
                    lifegroupExistente.setSector(lifegroupDetalhes.getSector()); // Permite alterar o setor
                    Lifegroup lifegroupAtualizado = lifegroupRepository.save(lifegroupExistente);
                    return ResponseEntity.ok(lifegroupAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLifegroup(@PathVariable UUID id) {
        if (!lifegroupRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        lifegroupRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}