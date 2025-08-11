package com.lifegroups.aplicativo.service;
import com.lifegroups.aplicativo.dto.area.AreaCriarDTO;
import com.lifegroups.aplicativo.model.Area;
import com.lifegroups.aplicativo.repository.AreaRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
@Service
public class AreaServico {
    @Autowired private AreaRepositorio areaRepositorio;
    @Transactional
    public Area criarArea(AreaCriarDTO dto) {
        Area novaArea = new Area();
        novaArea.setNome(dto.nome());
        return areaRepositorio.save(novaArea);
    }
    @Transactional(readOnly = true)
    public List<Area> buscarTodasAreas() { return areaRepositorio.findAll(); }
    @Transactional
    public void deletarArea(UUID id) { areaRepositorio.deleteById(id); }
}