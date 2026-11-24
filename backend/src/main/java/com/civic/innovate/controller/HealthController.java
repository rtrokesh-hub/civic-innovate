package com.civic.innovate.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Civic Innovate API");
        response.put("timestamp", Instant.now().toString());

        try {
            String dbVersion = jdbcTemplate.queryForObject("SELECT version()", String.class);
            response.put("database", "CONNECTED");
            response.put("databaseVersion", dbVersion);
        } catch (Exception e) {
            response.put("database", "DISCONNECTED: " + e.getMessage());
            return ResponseEntity.status(503).body(response);
        }

        return ResponseEntity.ok(response);
    }
}
