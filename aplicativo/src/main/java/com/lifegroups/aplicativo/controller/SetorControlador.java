package com.lifegroups.aplicativo.controller;
import com.lifegroups.aplicativo.dto.area.AreaDTO;
import com.lifegroups.aplicativo.dto.setor.SetorCriarDTO;
import com.lifegroups.aplicativo.dto.setor.SetorDTO;
import com.lifegroups.aplicativo.model.Setor;
import com.lifegroups.aplicativo.service.SetorServico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController @RequestMapping("/api/setores")
public class SetorControlador {
    @Autowired private SetorServico setorServico;
    private SetorDTO converterParaDTO(Setor setor) {
        AreaDTO areaDTO = new AreaDTO(setor.getArea().getId(), setor.getArea().getNome());
        return new SetorDTO(setor.getId(), setor.getNome(), areaDTO);
    }
    @GetMapping("/por-area/{idArea}")
    public List<SetorDTO> listarSetoresPorArea(@PathVariable UUID idArea) {
        return setorServico.buscarSetoresPorArea(idArea).stream().map(this::converterParaDTO).collect(Collectors.toList());
    }
    @PostMapping
    public SetorDTO criarSetor(@RequestBody SetorCriarDTO dto) {
        Setor setorSalvo = setorServico.criarSetor(dto);
        return converterParaDTO(setorSalvo);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarSetor(@PathVariable UUID id) {
        setorServico.deletarSetor(id);
        return ResponseEntity.noContent().build();
    }
}