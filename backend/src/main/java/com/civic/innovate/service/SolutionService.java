package com.civic.innovate.service;

import com.civic.innovate.entity.*;
import com.civic.innovate.repository.ChallengeRepository;
import com.civic.innovate.repository.IssueRepository;
import com.civic.innovate.repository.SolutionRepository;
import com.civic.innovate.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class SolutionService {

    private final SolutionRepository solutionRepository;
    private final TeamRepository teamRepository;
    private final ChallengeRepository challengeRepository;
    private final IssueRepository issueRepository;
    private final FileStorageService fileStorageService;

    public SolutionService(SolutionRepository solutionRepository,
                           TeamRepository teamRepository,
                           ChallengeRepository challengeRepository,
                           IssueRepository issueRepository,
                           FileStorageService fileStorageService) {
        this.solutionRepository = solutionRepository;
        this.teamRepository = teamRepository;
        this.challengeRepository = challengeRepository;
        this.issueRepository = issueRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public Solution submitSolution(User student, UUID teamId, String title, String abstractSummary,
                                   String githubUrl, String liveDemoUrl, String videoUrl, MultipartFile docFile) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("Team not found: " + teamId));

        if (!team.getLeadStudent().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Only the team lead can submit prototype solutions");
        }

        Challenge challenge = team.getChallenge();

        Solution solution = solutionRepository.findByTeamId(teamId).orElse(new Solution());
        solution.setTeam(team);
        solution.setChallenge(challenge);
        solution.setTitle(title);
        solution.setAbstractSummary(abstractSummary);
        solution.setGithubRepoUrl(githubUrl);
        solution.setLiveDemoUrl(liveDemoUrl);
        solution.setVideoDemoUrl(videoUrl);
        solution.setStage("PROTOTYPE_SUBMITTED");

        if (docFile != null && !docFile.isEmpty()) {
            solution.setTechnicalDocUrls(fileStorageService.storeFile(docFile));
        }

        Solution savedSolution = solutionRepository.save(solution);

        team.setStatus("SUBMITTED");
        teamRepository.save(team);

        challenge.setStatus("UNDER_EVALUATION");
        challengeRepository.save(challenge);

        Issue issue = challenge.getIssue();
        if (issue != null) {
            issue.setStatus(IssueStatus.PROTOTYPE_SUBMITTED);
            issueRepository.save(issue);
        }

        return savedSolution;
    }

    @Transactional(readOnly = true)
    public List<Solution> getSolutionsByChallenge(UUID challengeId) {
        return solutionRepository.findByChallengeId(challengeId);
    }

    @Transactional(readOnly = true)
    public Solution getSolutionById(UUID id) {
        return solutionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Solution not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Solution> getAllSolutions() {
        return solutionRepository.findAllByOrderByCreatedAtDesc();
    }
}
