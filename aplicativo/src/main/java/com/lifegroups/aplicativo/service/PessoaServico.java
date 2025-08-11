package com.lifegroups.aplicativo.service;

import com.lifegroups.aplicativo.dto.pessoa.PessoaCriarDTO;
import com.lifegroups.aplicativo.dto.pessoa.PessoaAtualizarDTO;
import com.lifegroups.aplicativo.model.LifeGroup;
import com.lifegroups.aplicativo.model.Pessoa;
import com.lifegroups.aplicativo.repository.LifeGroupRepositorio;
import com.lifegroups.aplicativo.repository.PessoaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PessoaServico {

    @Autowired
    private PessoaRepositorio pessoaRepositorio;

    @Autowired
    private LifeGroupRepositorio lifeGroupRepositorio;

    @Transactional(readOnly = true)
    public List<Pessoa> buscarPessoasPorLifeGroup(UUID idLifeGroup) {
        return pessoaRepositorio.findByLifeGroupId(idLifeGroup);
    }

    @Transactional
    public Pessoa criarPessoa(PessoaCriarDTO dto) {
        if (dto.idLifeGroup() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O id do LifeGroup não pode ser nulo.");
        }
        LifeGroup lifeGroup = lifeGroupRepositorio.findById(dto.idLifeGroup())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "LifeGroup não encontrado com id: " + dto.idLifeGroup()));

        Pessoa novaPessoa = new Pessoa();
        novaPessoa.setNome(dto.nome());
        novaPessoa.setContato(dto.contato());
        novaPessoa.setEndereco(dto.endereco());
        novaPessoa.setDataNascimento(dto.dataNascimento());
        novaPessoa.setLifeGroup(lifeGroup);
        
        return pessoaRepositorio.save(novaPessoa);
    }

    @Transactional
    public Pessoa atualizarPessoa(UUID idPessoa, PessoaAtualizarDTO dto) {
        Pessoa pessoaExistente = pessoaRepositorio.findById(idPessoa)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pessoa não encontrada com id: " + idPessoa));

        // LÓGICA DE ATUALIZAÇÃO INTELIGENTE:
        // Só atualiza um campo se um novo valor for fornecido no DTO.

        if (dto.nome() != null && !dto.nome().isBlank()) {
            pessoaExistente.setNome(dto.nome());
        }
        if (dto.contato() != null) {
            pessoaExistente.setContato(dto.contato());
        }
        if (dto.endereco() != null) {
            pessoaExistente.setEndereco(dto.endereco());
        }
        if (dto.dataNascimento() != null) {
            pessoaExistente.setDataNascimento(dto.dataNascimento());
        }
        
        return pessoaRepositorio.save(pessoaExistente);
    }

    @Transactional
    public void deletarPessoa(UUID id) {
        if (!pessoaRepositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pessoa não encontrada com id: " + id);
        }
        pessoaRepositorio.deleteById(id);
    }
}