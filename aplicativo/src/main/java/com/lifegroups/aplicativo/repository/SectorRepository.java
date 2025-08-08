package com.lifegroups.aplicativo.repository;

import com.lifegroups.aplicativo.model.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface SectorRepository extends JpaRepository<Sector, UUID> {
    List<Sector> findByAreaId(UUID areaId);
}