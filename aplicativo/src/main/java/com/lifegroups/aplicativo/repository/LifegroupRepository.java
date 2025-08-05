package com.lifegroups.sistema.repository;

import com.lifegroups.sistema.model.Lifegroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface LifegroupRepository extends JpaRepository<Lifegroup, UUID> {
}