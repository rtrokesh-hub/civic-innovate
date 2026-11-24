package com.civic.innovate.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "challenges")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "issue_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "citizen"})
    private Issue issue;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "problem_statement", nullable = false, columnDefinition = "TEXT")
    private String problemStatement;

    @Column(name = "expected_outcomes", columnDefinition = "TEXT")
    private String expectedOutcomes;

    @Column(name = "target_departments", length = 255)
    private String targetDepartments;

    @Column(name = "difficulty_level", length = 30)
    private String difficultyLevel = "INTERMEDIATE";

    @Column(nullable = false, length = 30)
    private String status = "OPEN";

    @Column(name = "submission_deadline")
    private LocalDate submissionDeadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_official_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "college"})
    private User createdByOfficial;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Challenge() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Issue getIssue() { return issue; }
    public void setIssue(Issue issue) { this.issue = issue; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getProblemStatement() { return problemStatement; }
    public void setProblemStatement(String problemStatement) { this.problemStatement = problemStatement; }
    public String getExpectedOutcomes() { return expectedOutcomes; }
    public void setExpectedOutcomes(String expectedOutcomes) { this.expectedOutcomes = expectedOutcomes; }
    public String getTargetDepartments() { return targetDepartments; }
    public void setTargetDepartments(String targetDepartments) { this.targetDepartments = targetDepartments; }
    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getSubmissionDeadline() { return submissionDeadline; }
    public void setSubmissionDeadline(LocalDate submissionDeadline) { this.submissionDeadline = submissionDeadline; }
    public User getCreatedByOfficial() { return createdByOfficial; }
    public void setCreatedByOfficial(User createdByOfficial) { this.createdByOfficial = createdByOfficial; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
