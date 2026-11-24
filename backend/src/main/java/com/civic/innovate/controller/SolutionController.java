package com.civic.innovate.controller;

import com.civic.innovate.entity.Solution;
import com.civic.innovate.entity.User;
import com.civic.innovate.service.SolutionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/solutions")
public class SolutionController {

    private final SolutionService solutionService;

    public SolutionController(SolutionService solutionService) {
        this.solutionService = solutionService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Solution> submitSolution(
            @AuthenticationPrincipal User student,
            @RequestParam("teamId") UUID teamId,
            @RequestParam("title") String title,
            @RequestParam("abstractSummary") String abstractSummary,
            @RequestParam(value = "githubRepoUrl", required = false) String githubRepoUrl,
            @RequestParam(value = "liveDemoUrl", required = false) String liveDemoUrl,
            @RequestParam(value = "videoDemoUrl", required = false) String videoDemoUrl,
            @RequestParam(value = "document", required = false) MultipartFile document) {

        Solution solution = solutionService.submitSolution(student, teamId, title, abstractSummary, githubRepoUrl, liveDemoUrl, videoDemoUrl, document);
        return ResponseEntity.status(HttpStatus.CREATED).body(solution);
    }

    @GetMapping("/challenge/{challengeId}")
    public ResponseEntity<List<Solution>> getSolutionsByChallenge(@PathVariable UUID challengeId) {
        return ResponseEntity.ok(solutionService.getSolutionsByChallenge(challengeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solution> getSolutionById(@PathVariable UUID id) {
        return ResponseEntity.ok(solutionService.getSolutionById(id));
    }

    @GetMapping
    public ResponseEntity<List<Solution>> getAllSolutions() {
        return ResponseEntity.ok(solutionService.getAllSolutions());
    }
}
