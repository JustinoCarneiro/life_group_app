package com.lifegroups.aplicativo.repository;

import com.lifegroups.aplicativo.model.LifeGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LifeGroupRepository extends JpaRepository<LifeGroup, UUID> {
    
    @Query("SELECT lg FROM LifeGroup lg JOIN FETCH lg.sector WHERE lg.sector.id = :sectorId")
    List<LifeGroup> findBySectorId(@Param("sectorId") UUID sectorId);
}