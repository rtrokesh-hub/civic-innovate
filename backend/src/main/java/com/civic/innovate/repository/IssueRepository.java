package com.civic.innovate.repository;

import com.civic.innovate.entity.Issue;
import com.civic.innovate.entity.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IssueRepository extends JpaRepository<Issue, UUID> {
    List<Issue> findByCitizenIdOrderByCreatedAtDesc(UUID citizenId);
    List<Issue> findByStatusOrderByCreatedAtDesc(IssueStatus status);
    List<Issue> findAllByOrderByCreatedAtDesc();
}
