package com.civic.innovate.repository;

import com.civic.innovate.entity.Solution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SolutionRepository extends JpaRepository<Solution, UUID> {
    List<Solution> findByChallengeId(UUID challengeId);
    Optional<Solution> findByTeamId(UUID teamId);
    List<Solution> findAllByOrderByCreatedAtDesc();
}
