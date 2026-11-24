package com.civic.innovate.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "solutions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Solution {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "challenge"})
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "issue"})
    private Challenge challenge;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "abstract_summary", nullable = false, columnDefinition = "TEXT")
    private String abstractSummary;

    @Column(name = "github_repo_url", length = 300)
    private String githubRepoUrl;

    @Column(name = "live_demo_url", length = 300)
    private String liveDemoUrl;

    @Column(name = "video_demo_url", length = 300)
    private String videoDemoUrl;

    @Column(name = "technical_doc_urls", columnDefinition = "TEXT")
    private String technicalDocUrls;

    @Column(nullable = false, length = 40)
    private String stage = "PROTOTYPE_SUBMITTED";

    @Column(name = "average_score", precision = 5, scale = 2)
    private BigDecimal averageScore;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Solution() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Team getTeam() { return team; }
    public void setTeam(Team team) { this.team = team; }
    public Challenge getChallenge() { return challenge; }
    public void setChallenge(Challenge challenge) { this.challenge = challenge; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAbstractSummary() { return abstractSummary; }
    public void setAbstractSummary(String abstractSummary) { this.abstractSummary = abstractSummary; }
    public String getGithubRepoUrl() { return githubRepoUrl; }
    public void setGithubRepoUrl(String githubRepoUrl) { this.githubRepoUrl = githubRepoUrl; }
    public String getLiveDemoUrl() { return liveDemoUrl; }
    public void setLiveDemoUrl(String liveDemoUrl) { this.liveDemoUrl = liveDemoUrl; }
    public String getVideoDemoUrl() { return videoDemoUrl; }
    public void setVideoDemoUrl(String videoDemoUrl) { this.videoDemoUrl = videoDemoUrl; }
    public String getTechnicalDocUrls() { return technicalDocUrls; }
    public void setTechnicalDocUrls(String technicalDocUrls) { this.technicalDocUrls = technicalDocUrls; }
    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }
    public BigDecimal getAverageScore() { return averageScore; }
    public void setAverageScore(BigDecimal averageScore) { this.averageScore = averageScore; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
