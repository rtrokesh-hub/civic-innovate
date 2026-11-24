package com.civic.innovate.service;

import com.civic.innovate.entity.Issue;
import com.civic.innovate.entity.IssueStatus;
import com.civic.innovate.entity.User;
import com.civic.innovate.repository.IssueRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.*;

@Service
public class IssueService {

    private final IssueRepository issueRepository;
    private final FileStorageService fileStorageService;
    private final GeminiAiService geminiAiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public IssueService(IssueRepository issueRepository,
                        FileStorageService fileStorageService,
                        GeminiAiService geminiAiService) {
        this.issueRepository = issueRepository;
        this.fileStorageService = fileStorageService;
        this.geminiAiService = geminiAiService;
    }

    @Transactional
    public Issue reportIssue(User citizen, String title, String description, String category,
                            BigDecimal latitude, BigDecimal longitude, String address, String city,
                            List<MultipartFile> images) {
        Issue issue = new Issue(citizen, title, description, latitude, longitude, address, city);
        issue.setCategory(category);

        if (images != null && !images.isEmpty()) {
            List<String> urls = new ArrayList<>();
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    urls.add(fileStorageService.storeFile(image));
                }
            }
            issue.setImageUrls(String.join(",", urls));
        }

        // Trigger AI analysis
        try {
            Map<String, Object> aiResult = geminiAiService.analyzeIssue(issue);
            issue.setAiAnalysis(objectMapper.writeValueAsString(aiResult));
            if (aiResult.containsKey("urgencyScore")) {
                issue.setUrgencyScore((Integer) aiResult.get("urgencyScore"));
            }
            issue.setStatus(IssueStatus.AI_ANALYZED);
        } catch (Exception e) {
            System.err.println("AI analysis failed: " + e.getMessage());
        }

        return issueRepository.save(issue);
    }

    @Transactional(readOnly = true)
    public List<Issue> getAllIssues(String status) {
        if (status != null && !status.isBlank()) {
            try {
                return issueRepository.findByStatusOrderByCreatedAtDesc(IssueStatus.valueOf(status));
            } catch (IllegalArgumentException ignored) {}
        }
        return issueRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<Issue> getCitizenIssues(UUID citizenId) {
        return issueRepository.findByCitizenIdOrderByCreatedAtDesc(citizenId);
    }

    @Transactional(readOnly = true)
    public Issue getIssueById(UUID id) {
        return issueRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Issue not found: " + id));
    }
}
