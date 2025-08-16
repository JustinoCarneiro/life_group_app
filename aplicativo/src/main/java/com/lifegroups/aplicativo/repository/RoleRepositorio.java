package com.lifegroups.aplicativo.repository;

import com.lifegroups.aplicativo.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RoleRepositorio extends JpaRepository<Role, Long> {
    Optional<Role> findByNome(String nome);
}