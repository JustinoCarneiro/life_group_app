package com.lifegroups.aplicativo.repository;

import com.lifegroups.aplicativo.model.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Adicione este import
import java.util.UUID;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, UUID> {
    List<Pessoa> findByLifegroupId(UUID lifegroupId);
}