package com.civic.innovate.repository;

import com.civic.innovate.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TeamRepository extends JpaRepository<Team, UUID> {
    List<Team> findByLeadStudentId(UUID studentId);
    List<Team> findByChallengeId(UUID challengeId);
    List<Team> findByCollegeId(UUID collegeId);
}
