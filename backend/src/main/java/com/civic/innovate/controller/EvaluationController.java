package com.civic.innovate.controller;

import com.civic.innovate.entity.Evaluation;
import com.civic.innovate.entity.User;
import com.civic.innovate.service.EvaluationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/evaluations")
public class EvaluationController {

    private final EvaluationService evaluationService;

    public EvaluationController(EvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('GOV_OFFICIAL') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Evaluation> evaluate(
            @AuthenticationPrincipal User official,
            @RequestBody Map<String, Object> payload) {

        UUID solutionId = UUID.fromString((String) payload.get("solutionId"));
        int technicalScore = ((Number) payload.get("technicalFeasibilityScore")).intValue();
        int costScore = ((Number) payload.get("costEffectivenessScore")).intValue();
        int impactScore = ((Number) payload.get("communityImpactScore")).intValue();
        int scalabilityScore = ((Number) payload.get("scalabilityScore")).intValue();
        String feedback = (String) payload.get("detailedFeedback");
        String recommendation = (String) payload.get("recommendation");

        Evaluation evaluation = evaluationService.evaluateSolution(
                official, solutionId, technicalScore, costScore, impactScore, scalabilityScore, feedback, recommendation
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(evaluation);
    }

    @GetMapping("/solution/{solutionId}")
    public ResponseEntity<List<Evaluation>> getBySolution(@PathVariable UUID solutionId) {
        return ResponseEntity.ok(evaluationService.getEvaluationsBySolution(solutionId));
    }
}
