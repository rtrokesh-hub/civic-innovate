package com.civic.innovate.repository;

import com.civic.innovate.entity.PilotProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PilotProjectRepository extends JpaRepository<PilotProject, UUID> {
    Optional<PilotProject> findBySolutionId(UUID solutionId);
    List<PilotProject> findAllByOrderByCreatedAtDesc();
}
