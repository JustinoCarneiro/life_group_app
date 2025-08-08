package com.lifegroups.aplicativo.controller;

import com.lifegroups.aplicativo.dto.PessoaCreateDTO;
import com.lifegroups.aplicativo.dto.PessoaDTO;
import com.lifegroups.aplicativo.model.LifeGroup;
import com.lifegroups.aplicativo.model.Pessoa;
import com.lifegroups.aplicativo.repository.LifeGroupRepository;
import com.lifegroups.aplicativo.repository.PessoaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {

    @Autowired
    private PessoaRepository pessoaRepository;

    @Autowired
    private LifeGroupRepository lifeGroupRepository; // Injetado para encontrar o LifeGroup ao criar uma Pessoa

    /**
     * Converte uma entidade Pessoa para o seu DTO correspondente.
     * Essencial para controlar os dados enviados ao front-end e evitar erros de lazy loading.
     */
    private PessoaDTO convertToDTO(Pessoa pessoa) {
        return new PessoaDTO(
            pessoa.getId(),
            pessoa.getName(),
            pessoa.getContact(),
            pessoa.getAddress(),
            pessoa.getBirth_date(),
            pessoa.getLifegroup() != null ? pessoa.getLifegroup().getId() : null,
            pessoa.is_leader(),
            pessoa.is_assistant(),
            pessoa.getDiscipler() != null ? pessoa.getDiscipler().getId() : null,
            pessoa.getSteps()
        );
    }

    @GetMapping
    public List<PessoaDTO> listarPessoas() {
        return pessoaRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/por-lifegroup/{lifegroupId}")
    public List<PessoaDTO> listarPessoasPorLifegroup(@PathVariable UUID lifegroupId) {
        return pessoaRepository.findByLifegroupId(lifegroupId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PessoaDTO> buscarPessoaPorId(@PathVariable UUID id) {
        return pessoaRepository.findById(id)
                .map(pessoa -> ResponseEntity.ok(convertToDTO(pessoa)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PessoaDTO> criarPessoa(@RequestBody PessoaCreateDTO dto) {
        if (dto.lifegroupId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O lifegroupId não pode ser nulo.");
        }

        // Busca a entidade LifeGroup completa a partir do ID fornecido no DTO
        LifeGroup lifegroup = lifeGroupRepository.findById(dto.lifegroupId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "LifeGroup não encontrado com id: " + dto.lifegroupId()));

        Pessoa novaPessoa = new Pessoa();
        novaPessoa.setName(dto.name());
        novaPessoa.setLifegroup(lifegroup); // Associa a entidade completa
        
        Pessoa pessoaSalva = pessoaRepository.save(novaPessoa);
        
        return ResponseEntity.ok(convertToDTO(pessoaSalva));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PessoaDTO> atualizarPessoa(@PathVariable UUID id, @RequestBody Pessoa pessoaDetalhes) {
        return pessoaRepository.findById(id)
            .map(pessoaExistente -> {
                pessoaExistente.setName(pessoaDetalhes.getName());
                pessoaExistente.setContact(pessoaDetalhes.getContact());
                pessoaExistente.setAddress(pessoaDetalhes.getAddress());
                pessoaExistente.setBirth_date(pessoaDetalhes.getBirth_date());
                // Lógica para atualizar o lifegroup, se necessário
                Pessoa pessoaAtualizada = pessoaRepository.save(pessoaExistente);
                return ResponseEntity.ok(convertToDTO(pessoaAtualizada));
            })
            .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPessoa(@PathVariable UUID id) {
        if (!pessoaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        pessoaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}