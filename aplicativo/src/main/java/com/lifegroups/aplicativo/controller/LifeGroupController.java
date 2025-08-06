package com.lifegroups.aplicativo.controller;

import com.lifegroups.aplicativo.model.LifeGroup;
import com.lifegroups.aplicativo.repository.LifeGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lifegroups")
public class LifeGroupController {

    @Autowired
    private LifeGroupRepository lifeGroupRepository;

    @GetMapping
    public List<LifeGroup> listarLifeGroups() {
        return lifeGroupRepository.findAll();
    }

    @PostMapping
    public LifeGroup criarLifeGroup(@RequestBody LifeGroup lifeGroup) {
        return lifeGroupRepository.save(lifeGroup);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LifeGroup> buscarLifeGroupPorId(@PathVariable UUID id) {
        return lifeGroupRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<LifeGroup> atualizarLifeGroup(@PathVariable UUID id, @RequestBody LifeGroup lifeGroupDetalhes) {
        return lifeGroupRepository.findById(id)
                .map(lifeGroupExistente -> {
                    lifeGroupExistente.setName(lifeGroupDetalhes.getName());
                    lifeGroupExistente.setSector(lifeGroupDetalhes.getSector()); // Permite alterar o setor
                    LifeGroup lifeGroupAtualizado = lifeGroupRepository.save(lifeGroupExistente);
                    return ResponseEntity.ok(lifeGroupAtualizado);
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