package com.civic.innovate.controller;

import com.civic.innovate.entity.Issue;
import com.civic.innovate.entity.User;
import com.civic.innovate.service.IssueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/issues")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CITIZEN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Issue> reportIssue(
            @AuthenticationPrincipal User citizen,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam("latitude") BigDecimal latitude,
            @RequestParam("longitude") BigDecimal longitude,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "city", required = false) String city,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {

        Issue issue = issueService.reportIssue(citizen, title, description, category, latitude, longitude, address, city, images);
        return ResponseEntity.status(HttpStatus.CREATED).body(issue);
    }

    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues(@RequestParam(value = "status", required = false) String status) {
        return ResponseEntity.ok(issueService.getAllIssues(status));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Issue>> getMyIssues(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(issueService.getCitizenIssues(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(@PathVariable UUID id) {
        return ResponseEntity.ok(issueService.getIssueById(id));
    }
}
