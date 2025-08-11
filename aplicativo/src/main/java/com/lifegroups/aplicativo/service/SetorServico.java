package com.lifegroups.aplicativo.service;
import com.lifegroups.aplicativo.dto.setor.SetorCriarDTO;
import com.lifegroups.aplicativo.model.Area;
import com.lifegroups.aplicativo.model.Setor;
import com.lifegroups.aplicativo.repository.AreaRepositorio;
import com.lifegroups.aplicativo.repository.SetorRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.UUID;
@Service
public class SetorServico {
    @Autowired private SetorRepositorio setorRepositorio;
    @Autowired private AreaRepositorio areaRepositorio;
    @Transactional
    public Setor criarSetor(SetorCriarDTO dto) {
        Area area = areaRepositorio.findById(dto.areaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Área não encontrada"));
        Setor novoSetor = new Setor();
        novoSetor.setNome(dto.nome());
        novoSetor.setArea(area);
        return setorRepositorio.save(novoSetor);
    }
    @Transactional(readOnly = true)
    public List<Setor> buscarSetoresPorArea(UUID idArea) { return setorRepositorio.buscarPorIdArea(idArea); }
    @Transactional
    public void deletarSetor(UUID id) {
        if (!setorRepositorio.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Setor não encontrado com id: " + id);
        }
        setorRepositorio.deleteById(id);
    }
}