package com.civic.innovate.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "teams")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "issue", "createdByOfficial"})
    private Challenge challenge;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lead_student_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "college"})
    private User leadStudent;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "college_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private College college;

    @Column(name = "faculty_mentor_name", length = 100)
    private String facultyMentorName;

    @Column(name = "faculty_mentor_email", length = 150)
    private String facultyMentorEmail;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public Team() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Challenge getChallenge() { return challenge; }
    public void setChallenge(Challenge challenge) { this.challenge = challenge; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public User getLeadStudent() { return leadStudent; }
    public void setLeadStudent(User leadStudent) { this.leadStudent = leadStudent; }
    public College getCollege() { return college; }
    public void setCollege(College college) { this.college = college; }
    public String getFacultyMentorName() { return facultyMentorName; }
    public void setFacultyMentorName(String facultyMentorName) { this.facultyMentorName = facultyMentorName; }
    public String getFacultyMentorEmail() { return facultyMentorEmail; }
    public void setFacultyMentorEmail(String facultyMentorEmail) { this.facultyMentorEmail = facultyMentorEmail; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
