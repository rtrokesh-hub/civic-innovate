package com.civic.innovate.service;

import com.civic.innovate.entity.Challenge;
import com.civic.innovate.entity.College;
import com.civic.innovate.entity.Team;
import com.civic.innovate.entity.User;
import com.civic.innovate.repository.ChallengeRepository;
import com.civic.innovate.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final ChallengeRepository challengeRepository;
    private final com.civic.innovate.repository.UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, ChallengeRepository challengeRepository, com.civic.innovate.repository.UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.challengeRepository = challengeRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Team createTeam(User student, UUID challengeId, String name, String mentorName, String mentorEmail) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found: " + challengeId));

        User managedStudent = userRepository.findById(student.getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        College college = managedStudent.getCollege();
        if (college == null) {
            throw new IllegalArgumentException("Student must be affiliated with a verified college to form a team");
        }

        Team team = new Team();
        team.setChallenge(challenge);
        team.setName(name);
        team.setLeadStudent(managedStudent);
        team.setCollege(college);
        team.setFacultyMentorName(mentorName);
        team.setFacultyMentorEmail(mentorEmail);
        team.setStatus("ACTIVE");

        challenge.setStatus("IN_PROGRESS");
        challengeRepository.save(challenge);

        return teamRepository.save(team);
    }

    @Transactional(readOnly = true)
    public List<Team> getMyTeams(UUID studentId) {
        return teamRepository.findByLeadStudentId(studentId);
    }

    @Transactional(readOnly = true)
    public List<Team> getTeamsByChallenge(UUID challengeId) {
        return teamRepository.findByChallengeId(challengeId);
    }

    @Transactional(readOnly = true)
    public List<Team> getTeamsByCollege(UUID collegeId) {
        return teamRepository.findByCollegeId(collegeId);
    }
}
