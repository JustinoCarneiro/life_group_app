package com.lifegroups.aplicativo.service;

import com.lifegroups.aplicativo.dto.lifegroup.LifeGroupCriarDTO;
import com.lifegroups.aplicativo.model.LifeGroup;
import com.lifegroups.aplicativo.model.Setor;
import com.lifegroups.aplicativo.repository.LifeGroupRepositorio;
import com.lifegroups.aplicativo.repository.SetorRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class LifeGroupServico {

    @Autowired
    private LifeGroupRepositorio lifeGroupRepositorio;

    @Autowired
    private SetorRepositorio setorRepositorio;

    @Transactional
    public LifeGroup criarLifeGroup(LifeGroupCriarDTO dto) {
        Setor setor = setorRepositorio.findById(dto.setorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Setor não encontrado com id: " + dto.setorId()));
            
        LifeGroup novoLifeGroup = new LifeGroup();
        novoLifeGroup.setNome(dto.nome());
        novoLifeGroup.setSetor(setor);
        return lifeGroupRepositorio.save(novoLifeGroup);
    }

    @Transactional(readOnly = true)
    public List<LifeGroup> buscarLifeGroupsPorSetor(UUID idSetor) {
        return lifeGroupRepositorio.buscarPorIdSetor(idSetor);
    }

    @Transactional
    public void deletarLifeGroup(UUID id) {
        if (!lifeGroupRepositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "LifeGroup não encontrado com id: " + id);
        }
        lifeGroupRepositorio.deleteById(id);
    }
}