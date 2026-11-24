package com.civic.innovate.repository;

import com.civic.innovate.entity.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {
    List<Evaluation> findBySolutionId(UUID solutionId);
}
