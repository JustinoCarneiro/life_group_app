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

import java.util.UUID;

@Service
public class PessoaServico {

    @Autowired
    private PessoaRepositorio pessoaRepositorio;

    @Autowired
    private LifeGroupRepositorio lifeGroupRepositorio;

    @Transactional
    public Pessoa criarPessoa(PessoaCriarDTO dto) {
        if (dto.idLifeGroup() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O id do LifeGroup não pode ser nulo.");
        }

        LifeGroup lifeGroup = lifeGroupRepositorio.findById(dto.idLifeGroup())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "LifeGroup não encontrado com id: " + dto.idLifeGroup()));

        Pessoa novaPessoa = new Pessoa();
        novaPessoa.setNome(dto.nome());
        novaPessoa.setLifeGroup(lifeGroup);
        
        return pessoaRepositorio.save(novaPessoa);
    }

    @Transactional
    public Pessoa atualizarPessoa(UUID idPessoa, PessoaAtualizarDTO dto) {
        Pessoa pessoaExistente = pessoaRepositorio.findById(idPessoa)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pessoa não encontrada com id: " + idPessoa));

        pessoaExistente.setNome(dto.nome());
        pessoaExistente.setContato(dto.contato());
        pessoaExistente.setEndereco(dto.endereco());
        pessoaExistente.setDataNascimento(dto.dataNascimento());

        return pessoaRepositorio.save(pessoaExistente);
    }
}