package com.civic.innovate.controller;

import com.civic.innovate.entity.Challenge;
import com.civic.innovate.entity.User;
import com.civic.innovate.service.ChallengeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @PostMapping("/convert/{issueId}")
    @PreAuthorize("hasRole('GOV_OFFICIAL') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Challenge> convertToChallenge(
            @PathVariable UUID issueId,
            @AuthenticationPrincipal User official,
            @RequestBody Map<String, Object> payload) {

        String title = (String) payload.get("title");
        String problemStatement = (String) payload.get("problemStatement");
        String expectedOutcomes = (String) payload.get("expectedOutcomes");
        String targetDepartments = (String) payload.get("targetDepartments");
        String difficultyLevel = (String) payload.get("difficultyLevel");
        String deadlineStr = (String) payload.get("submissionDeadline");
        LocalDate deadline = deadlineStr != null ? LocalDate.parse(deadlineStr) : null;

        Challenge challenge = challengeService.convertIssueToChallenge(
                issueId, official, title, problemStatement, expectedOutcomes, targetDepartments, difficultyLevel, deadline
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(challenge);
    }

    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges(@RequestParam(value = "department", required = false) String department) {
        return ResponseEntity.ok(challengeService.getAllChallenges(department));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallengeById(@PathVariable UUID id) {
        return ResponseEntity.ok(challengeService.getChallengeById(id));
    }
}
