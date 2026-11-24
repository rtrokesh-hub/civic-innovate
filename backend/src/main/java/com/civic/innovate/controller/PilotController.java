package com.civic.innovate.controller;

import com.civic.innovate.entity.PilotProject;
import com.civic.innovate.entity.User;
import com.civic.innovate.service.PilotService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pilots")
public class PilotController {

    private final PilotService pilotService;

    public PilotController(PilotService pilotService) {
        this.pilotService = pilotService;
    }

    @PostMapping("/promote/{solutionId}")
    @PreAuthorize("hasRole('GOV_OFFICIAL') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<PilotProject> promoteToPilot(
            @PathVariable UUID solutionId,
            @AuthenticationPrincipal User official,
            @RequestBody Map<String, Object> payload) {

        BigDecimal budget = payload.get("allocatedBudget") != null ? new BigDecimal(payload.get("allocatedBudget").toString()) : null;
        String currency = (String) payload.get("currency");
        String deadlineStr = (String) payload.get("targetCompletionDate");
        LocalDate deadline = deadlineStr != null ? LocalDate.parse(deadlineStr) : null;

        PilotProject pilot = pilotService.promoteToPilot(official, solutionId, budget, currency, deadline);
        return ResponseEntity.status(HttpStatus.CREATED).body(pilot);
    }

    @PatchMapping("/{id}/milestone")
    @PreAuthorize("hasRole('GOV_OFFICIAL') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<PilotProject> updateMilestone(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {

        String phase = payload.get("currentPhase");
        String title = payload.get("milestoneTitle");
        String notes = payload.get("milestoneNotes");

        PilotProject pilot = pilotService.updateMilestone(id, phase, title, notes);
        return ResponseEntity.ok(pilot);
    }

    @PostMapping("/{id}/resolve")
    @PreAuthorize("hasRole('GOV_OFFICIAL') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<PilotProject> resolve(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload) {

        String outcomeNotes = payload.getOrDefault("outcomeNotes", "Field implementation verified successfully.");
        PilotProject pilot = pilotService.resolvePilotAndIssue(id, outcomeNotes);
        return ResponseEntity.ok(pilot);
    }

    @GetMapping
    public ResponseEntity<List<PilotProject>> getAllPilots() {
        return ResponseEntity.ok(pilotService.getAllPilots());
    }

    @GetMapping("/analytics/impact")
    public ResponseEntity<Map<String, Object>> getImpactAnalytics() {
        return ResponseEntity.ok(pilotService.getCityImpactStats());
    }
}
