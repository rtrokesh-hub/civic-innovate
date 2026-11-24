package com.civic.innovate.service;

import com.civic.innovate.entity.Challenge;
import com.civic.innovate.entity.Issue;
import com.civic.innovate.entity.IssueStatus;
import com.civic.innovate.entity.User;
import com.civic.innovate.repository.ChallengeRepository;
import com.civic.innovate.repository.IssueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final IssueRepository issueRepository;

    public ChallengeService(ChallengeRepository challengeRepository, IssueRepository issueRepository) {
        this.challengeRepository = challengeRepository;
        this.issueRepository = issueRepository;
    }

    @Transactional
    public Challenge convertIssueToChallenge(UUID issueId, User official, String title,
                                           String problemStatement, String expectedOutcomes,
                                           String targetDepartments, String difficultyLevel,
                                           LocalDate submissionDeadline) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found: " + issueId));

        if (challengeRepository.findByIssueId(issueId).isPresent()) {
            throw new IllegalArgumentException("Challenge already formulated for this issue");
        }

        Challenge challenge = new Challenge();
        challenge.setIssue(issue);
        challenge.setTitle(title != null && !title.isBlank() ? title : issue.getTitle());
        challenge.setProblemStatement(problemStatement);
        challenge.setExpectedOutcomes(expectedOutcomes);
        challenge.setTargetDepartments(targetDepartments);
        challenge.setDifficultyLevel(difficultyLevel != null ? difficultyLevel : "INTERMEDIATE");
        challenge.setSubmissionDeadline(submissionDeadline != null ? submissionDeadline : LocalDate.now().plusMonths(2));
        challenge.setCreatedByOfficial(official);
        challenge.setStatus("OPEN");

        issue.setStatus(IssueStatus.CHALLENGE_FORMULATED);
        issueRepository.save(issue);

        return challengeRepository.save(challenge);
    }

    @Transactional(readOnly = true)
    public List<Challenge> getAllChallenges(String department) {
        List<Challenge> challenges = challengeRepository.findAllByOrderByCreatedAtDesc();
        if (department != null && !department.isBlank()) {
            return challenges.stream()
                    .filter(c -> c.getTargetDepartments() != null && c.getTargetDepartments().contains(department))
                    .toList();
        }
        return challenges;
    }

    @Transactional(readOnly = true)
    public Challenge getChallengeById(UUID id) {
        return challengeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found: " + id));
    }
}
