package com.civic.innovate.service;

import com.civic.innovate.entity.*;
import com.civic.innovate.repository.EvaluationRepository;
import com.civic.innovate.repository.IssueRepository;
import com.civic.innovate.repository.SolutionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final SolutionRepository solutionRepository;
    private final IssueRepository issueRepository;

    public EvaluationService(EvaluationRepository evaluationRepository,
                             SolutionRepository solutionRepository,
                             IssueRepository issueRepository) {
        this.evaluationRepository = evaluationRepository;
        this.solutionRepository = solutionRepository;
        this.issueRepository = issueRepository;
    }

    @Transactional
    public Evaluation evaluateSolution(User official, UUID solutionId,
                                      int technicalScore, int costScore, int impactScore, int scalabilityScore,
                                      String feedback, String recommendation) {
        Solution solution = solutionRepository.findById(solutionId)
                .orElseThrow(() -> new IllegalArgumentException("Solution not found: " + solutionId));

        int totalScore = technicalScore + costScore + impactScore + scalabilityScore;

        Evaluation evaluation = new Evaluation();
        evaluation.setSolution(solution);
        evaluation.setOfficial(official);
        evaluation.setTechnicalFeasibilityScore(technicalScore);
        evaluation.setCostEffectivenessScore(costScore);
        evaluation.setCommunityImpactScore(impactScore);
        evaluation.setScalabilityScore(scalabilityScore);
        evaluation.setTotalScore(totalScore);
        evaluation.setDetailedFeedback(feedback);
        evaluation.setRecommendation(recommendation != null ? recommendation : "SHORTLIST_FOR_PILOT");
        evaluation.setEvaluatedAt(Instant.now());

        Evaluation savedEvaluation = evaluationRepository.save(evaluation);

        // Recalculate average score for solution
        List<Evaluation> allEvaluations = evaluationRepository.findBySolutionId(solutionId);
        double avg = allEvaluations.stream().mapToInt(Evaluation::getTotalScore).average().orElse(totalScore);
        solution.setAverageScore(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));

        if ("SHORTLIST_FOR_PILOT".equalsIgnoreCase(recommendation)) {
            solution.setStage("SHORTLISTED_FOR_PILOT");
        } else if ("REJECT".equalsIgnoreCase(recommendation)) {
            solution.setStage("REVISE_AND_RESUBMIT");
        } else {
            solution.setStage("UNDER_REVIEW");
        }
        solutionRepository.save(solution);

        Issue issue = solution.getChallenge().getIssue();
        if (issue != null) {
            issue.setStatus(IssueStatus.EVALUATED);
            issueRepository.save(issue);
        }

        return savedEvaluation;
    }

    @Transactional(readOnly = true)
    public List<Evaluation> getEvaluationsBySolution(UUID solutionId) {
        return evaluationRepository.findBySolutionId(solutionId);
    }
}
