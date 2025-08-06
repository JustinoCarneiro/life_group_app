package com.lifegroups.aplicativo.repository;

import com.lifegroups.aplicativo.model.LifeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface LifeGroupRepository extends JpaRepository<LifeGroup, UUID> {
}