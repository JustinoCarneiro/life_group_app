package com.lifegroups.aplicativo.repository;

import com.lifegroups.aplicativo.model.Setor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SetorRepositorio extends JpaRepository<Setor, UUID> {

    @Query("SELECT s FROM Setor s JOIN FETCH s.area WHERE s.area.id = :idArea")
    List<Setor> buscarPorIdArea(@Param("idArea") UUID idArea);
}