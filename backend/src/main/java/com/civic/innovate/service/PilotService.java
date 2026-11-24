package com.civic.innovate.service;

import com.civic.innovate.entity.*;
import com.civic.innovate.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class PilotService {

    private final PilotProjectRepository pilotProjectRepository;
    private final SolutionRepository solutionRepository;
    private final IssueRepository issueRepository;
    private final ChallengeRepository challengeRepository;
    private final TeamRepository teamRepository;

    public PilotService(PilotProjectRepository pilotProjectRepository,
                        SolutionRepository solutionRepository,
                        IssueRepository issueRepository,
                        ChallengeRepository challengeRepository,
                        TeamRepository teamRepository) {
        this.pilotProjectRepository = pilotProjectRepository;
        this.solutionRepository = solutionRepository;
        this.issueRepository = issueRepository;
        this.challengeRepository = challengeRepository;
        this.teamRepository = teamRepository;
    }

    @Transactional
    public PilotProject promoteToPilot(User official, UUID solutionId, BigDecimal budget, String currency, LocalDate completionDate) {
        Solution solution = solutionRepository.findById(solutionId)
                .orElseThrow(() -> new IllegalArgumentException("Solution not found: " + solutionId));

        if (pilotProjectRepository.findBySolutionId(solutionId).isPresent()) {
            throw new IllegalArgumentException("Pilot already created for this solution");
        }

        Challenge challenge = solution.getChallenge();
        Issue issue = challenge.getIssue();

        PilotProject pilot = new PilotProject();
        pilot.setSolution(solution);
        pilot.setChallenge(challenge);
        pilot.setLeadOfficial(official);
        pilot.setAllocatedBudget(budget != null ? budget : BigDecimal.valueOf(250000));
        pilot.setCurrency(currency != null ? currency : "INR");
        pilot.setStartDate(LocalDate.now());
        pilot.setTargetCompletionDate(completionDate != null ? completionDate : LocalDate.now().plusMonths(6));
        pilot.setCurrentPhase("PHASE_1_LAB_VALIDATION");
        pilot.setMilestoneLog("[{\"date\":\"" + LocalDate.now() + "\",\"title\":\"Pilot Sanctioned\",\"notes\":\"Approved for municipal pilot funding\",\"status\":\"IN_PROGRESS\"}]");

        solution.setStage("APPROVED_FOR_PILOT");
        solutionRepository.save(solution);

        if (issue != null) {
            issue.setStatus(IssueStatus.IN_PILOT);
            issueRepository.save(issue);
        }

        return pilotProjectRepository.save(pilot);
    }

    @Transactional
    public PilotProject updateMilestone(UUID pilotId, String newPhase, String milestoneTitle, String milestoneNotes) {
        PilotProject pilot = pilotProjectRepository.findById(pilotId)
                .orElseThrow(() -> new IllegalArgumentException("Pilot not found: " + pilotId));

        if (newPhase != null && !newPhase.isBlank()) {
            pilot.setCurrentPhase(newPhase);
        }

        String logEntry = "{\"date\":\"" + LocalDate.now() + "\",\"title\":\"" + milestoneTitle + "\",\"notes\":\"" + milestoneNotes + "\",\"status\":\"COMPLETED\"}";
        String existing = pilot.getMilestoneLog() != null ? pilot.getMilestoneLog() : "[]";
        if (existing.endsWith("]")) {
            existing = existing.substring(0, existing.length() - 1);
            if (existing.length() > 1) {
                existing += ",";
            }
            existing += logEntry + "]";
        } else {
            existing = "[" + logEntry + "]";
        }
        pilot.setMilestoneLog(existing);

        return pilotProjectRepository.save(pilot);
    }

    @Transactional
    public PilotProject resolvePilotAndIssue(UUID pilotId, String outcomeNotes) {
        PilotProject pilot = pilotProjectRepository.findById(pilotId)
                .orElseThrow(() -> new IllegalArgumentException("Pilot not found: " + pilotId));

        pilot.setCurrentPhase("PHASE_3_CITY_DEPLOYMENT");
        updateMilestone(pilotId, "PHASE_3_CITY_DEPLOYMENT", "Real-World Deployment Succeeded", outcomeNotes);

        Issue issue = pilot.getChallenge().getIssue();
        if (issue != null) {
            issue.setStatus(IssueStatus.RESOLVED);
            issueRepository.save(issue);
        }

        return pilotProjectRepository.save(pilot);
    }

    @Transactional(readOnly = true)
    public List<PilotProject> getAllPilots() {
        return pilotProjectRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getCityImpactStats() {
        long totalIssues = issueRepository.count();
        long resolvedIssues = issueRepository.findByStatusOrderByCreatedAtDesc(IssueStatus.RESOLVED).size();
        long activePilots = pilotProjectRepository.count();
        long totalChallenges = challengeRepository.count();
        long totalTeams = teamRepository.count();
        long totalSolutions = solutionRepository.count();

        BigDecimal totalBudget = pilotProjectRepository.findAll().stream()
                .map(PilotProject::getAllocatedBudget)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalIssuesReported", totalIssues);
        stats.put("resolvedIssues", resolvedIssues);
        stats.put("activePilots", activePilots);
        stats.put("totalChallenges", totalChallenges);
        stats.put("activeStudentTeams", totalTeams);
        stats.put("prototypeSolutionsSubmitted", totalSolutions);
        stats.put("totalBudgetDeployedINR", totalBudget);
        return stats;
    }
}
