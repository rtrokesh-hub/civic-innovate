package com.civic.innovate.controller;

import com.civic.innovate.entity.Team;
import com.civic.innovate.entity.User;
import com.civic.innovate.service.TeamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Team> createTeam(
            @AuthenticationPrincipal User student,
            @RequestBody Map<String, Object> payload) {

        UUID challengeId = UUID.fromString((String) payload.get("challengeId"));
        String name = (String) payload.get("name");
        String mentorName = (String) payload.get("facultyMentorName");
        String mentorEmail = (String) payload.get("facultyMentorEmail");

        Team team = teamService.createTeam(student, challengeId, name, mentorName, mentorEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(team);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Team>> getMyTeams(@AuthenticationPrincipal User student) {
        return ResponseEntity.ok(teamService.getMyTeams(student.getId()));
    }

    @GetMapping("/challenge/{challengeId}")
    public ResponseEntity<List<Team>> getTeamsByChallenge(@PathVariable UUID challengeId) {
        return ResponseEntity.ok(teamService.getTeamsByChallenge(challengeId));
    }

    @GetMapping("/college/{collegeId}")
    public ResponseEntity<List<Team>> getTeamsByCollege(@PathVariable UUID collegeId) {
        return ResponseEntity.ok(teamService.getTeamsByCollege(collegeId));
    }
}
