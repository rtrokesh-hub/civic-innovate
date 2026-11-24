package com.civic.innovate.repository;

import com.civic.innovate.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CollegeRepository extends JpaRepository<College, UUID> {
    Optional<College> findByCode(String code);
}
