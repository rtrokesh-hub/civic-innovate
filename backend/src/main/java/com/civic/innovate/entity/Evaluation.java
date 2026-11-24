package com.civic.innovate.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "evaluations")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solution_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "challenge", "team"})
    private Solution solution;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "official_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "college"})
    private User official;

    @Column(name = "technical_feasibility_score", nullable = false)
    private int technicalFeasibilityScore; // 1 to 25

    @Column(name = "cost_effectiveness_score", nullable = false)
    private int costEffectivenessScore; // 1 to 25

    @Column(name = "community_impact_score", nullable = false)
    private int communityImpactScore; // 1 to 25

    @Column(name = "scalability_score", nullable = false)
    private int scalabilityScore; // 1 to 25

    @Column(name = "total_score", nullable = false)
    private int totalScore; // 1 to 100

    @Column(name = "detailed_feedback", columnDefinition = "TEXT")
    private String detailedFeedback;

    @Column(nullable = false, length = 40)
    private String recommendation = "SHORTLIST_FOR_PILOT"; // SHORTLIST_FOR_PILOT, REVISE_PROPOSAL, REJECT

    @Column(name = "evaluated_at", nullable = false)
    private Instant evaluatedAt = Instant.now();

    public Evaluation() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Solution getSolution() { return solution; }
    public void setSolution(Solution solution) { this.solution = solution; }
    public User getOfficial() { return official; }
    public void setOfficial(User official) { this.official = official; }
    public int getTechnicalFeasibilityScore() { return technicalFeasibilityScore; }
    public void setTechnicalFeasibilityScore(int technicalFeasibilityScore) { this.technicalFeasibilityScore = technicalFeasibilityScore; }
    public int getCostEffectivenessScore() { return costEffectivenessScore; }
    public void setCostEffectivenessScore(int costEffectivenessScore) { this.costEffectivenessScore = costEffectivenessScore; }
    public int getCommunityImpactScore() { return communityImpactScore; }
    public void setCommunityImpactScore(int communityImpactScore) { this.communityImpactScore = communityImpactScore; }
    public int getScalabilityScore() { return scalabilityScore; }
    public void setScalabilityScore(int scalabilityScore) { this.scalabilityScore = scalabilityScore; }
    public int getTotalScore() { return totalScore; }
    public void setTotalScore(int totalScore) { this.totalScore = totalScore; }
    public String getDetailedFeedback() { return detailedFeedback; }
    public void setDetailedFeedback(String detailedFeedback) { this.detailedFeedback = detailedFeedback; }
    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
    public Instant getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(Instant evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
