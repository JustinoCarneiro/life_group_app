package com.lifegroups.aplicativo.controller;

import com.lifegroups.aplicativo.dto.pessoa.PessoaCriarDTO;
import com.lifegroups.aplicativo.dto.pessoa.PessoaDTO;
import com.lifegroups.aplicativo.dto.pessoa.PessoaAtualizarDTO;
import com.lifegroups.aplicativo.model.Pessoa;
import com.lifegroups.aplicativo.repository.PessoaRepositorio;
import com.lifegroups.aplicativo.service.PessoaServico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaControlador {

    @Autowired
    private PessoaRepositorio pessoaRepositorio;

    @Autowired
    private PessoaServico pessoaServico;

    private PessoaDTO converterParaDTO(Pessoa pessoa) {
        return new PessoaDTO(
            pessoa.getId(),
            pessoa.getNome(),
            pessoa.getContato(),
            pessoa.getEndereco(),
            pessoa.getDataNascimento(),
            pessoa.getLifeGroup() != null ? pessoa.getLifeGroup().getId() : null,
            pessoa.isEhLider(),
            pessoa.isEhAuxiliar(),
            pessoa.getDiscipulador() != null ? pessoa.getDiscipulador().getId() : null,
            pessoa.getPassos()
        );
    }

    @GetMapping("/por-lifegroup/{idLifeGroup}")
    public List<PessoaDTO> listarPessoasPorLifeGroup(@PathVariable UUID idLifeGroup) {
        return pessoaRepositorio.findByLifeGroupId(idLifeGroup)
                .stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<PessoaDTO> criarPessoa(@RequestBody PessoaCriarDTO dto) {
        Pessoa pessoaSalva = pessoaServico.criarPessoa(dto);
        return ResponseEntity.ok(converterParaDTO(pessoaSalva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PessoaDTO> atualizarPessoa(@PathVariable UUID id, @RequestBody PessoaAtualizarDTO dto) {
        Pessoa pessoaAtualizada = pessoaServico.atualizarPessoa(id, dto);
        return ResponseEntity.ok(converterParaDTO(pessoaAtualizada));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPessoa(@PathVariable UUID id) {
        if (!pessoaRepositorio.existsById(id)) {
            // Pode mover esta lógica para o serviço também
            return ResponseEntity.notFound().build();
        }
        pessoaRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}