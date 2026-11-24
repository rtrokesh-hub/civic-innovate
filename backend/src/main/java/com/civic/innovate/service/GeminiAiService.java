package com.civic.innovate.service;

import com.civic.innovate.entity.Issue;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
public class GeminiAiService {

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> analyzeIssue(Issue issue) {
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                return callGeminiApi(issue);
            } catch (Exception e) {
                System.err.println("Gemini API call failed, falling back to heuristic engine: " + e.getMessage());
            }
        }
        return runHeuristicTriage(issue);
    }

    private Map<String, Object> callGeminiApi(Issue issue) {
        String prompt = """
            You are a Municipal AI Triage Specialist for Smart City Civic Innovate.
            Analyze the following citizen report and return ONLY a valid JSON object:
            Title: %s
            Description: %s
            Location: %s

            JSON Schema required:
            {
              "identifiedCategory": "string",
              "urgencyLevel": "LOW | MEDIUM | HIGH | CRITICAL",
              "urgencyScore": 1 to 100,
              "rootCauseAnalysis": "string",
              "recommendedDepartments": ["CIVIL" | "ELECTRICAL" | "MECHANICAL" | "CSE_IT" | "ENVIRONMENTAL"],
              "suggestedProblemStatement": "string",
              "requiredEngineeringDisciplines": ["string"]
            }
            """.formatted(issue.getTitle(), issue.getDescription(), issue.getAddress());

        String requestUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(Map.of("text", prompt)))
            ),
            "generationConfig", Map.of("responseMimeType", "application/json")
        );

        RestClient restClient = RestClient.create();
        String response = restClient.post()
                .uri(requestUrl)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(String.class);

        try {
            var root = objectMapper.readTree(response);
            String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            return objectMapper.readValue(text, Map.class);
        } catch (Exception e) {
            return runHeuristicTriage(issue);
        }
    }

    public Map<String, Object> runHeuristicTriage(Issue issue) {
        String text = (issue.getTitle() + " " + issue.getDescription() + " " + (issue.getCategory() != null ? issue.getCategory() : "")).toLowerCase();

        String category;
        String urgencyLevel;
        int urgencyScore;
        String rootCause;
        List<String> departments = new ArrayList<>();
        String problemStatement;
        List<String> disciplines = new ArrayList<>();

        if (text.contains("flood") || text.contains("drain") || text.contains("water") || text.contains("pipe") || text.contains("leak")) {
            category = "DRAINAGE_AND_FLOODING";
            urgencyLevel = "CRITICAL";
            urgencyScore = 88;
            rootCause = "Stormwater conduit obstruction or burst transmission line causing localized surface pooling and foundation erosion.";
            departments = List.of("CIVIL", "ENVIRONMENTAL");
            problemStatement = "Design an automated, solar-powered debris clearing and ultrasonic water-level telemetry system for open stormwater drains.";
            disciplines = List.of("Hydraulic Engineering", "IoT Sensor Telemetry", "Structural Filtration");
        } else if (text.contains("road") || text.contains("pothole") || text.contains("crack") || text.contains("asphalt") || text.contains("bridge")) {
            category = "ROAD_INFRASTRUCTURE";
            urgencyLevel = "HIGH";
            urgencyScore = 78;
            rootCause = "Sub-base moisture penetration causing asphalt surface fatigue, raveling, and hazardous vehicular impact zones.";
            departments = List.of("CIVIL", "MECHANICAL");
            problemStatement = "Develop a rapid cold-patch composite polymer binder and automated thermal crack-sealing applicator for municipal roadways.";
            disciplines = List.of("Pavement Materials Science", "Robotics & Automation", "Mechanical Dispensers");
        } else if (text.contains("wire") || text.contains("electric") || text.contains("power") || text.contains("transformer") || text.contains("light") || text.contains("pole")) {
            category = "ELECTRICAL_GRID_AND_LIGHTING";
            urgencyLevel = "CRITICAL";
            urgencyScore = 92;
            rootCause = "Exposed overhead conductor breakdown or aging luminaire driver failure presenting immediate electrocution hazard.";
            departments = List.of("ELECTRICAL", "CSE_IT");
            problemStatement = "Engineer an intelligent smart-streetlight controller with fault-detection mesh network and automated high-voltage isolation.";
            disciplines = List.of("Power Electronics", "Mesh Networking", "Embedded Firmware");
        } else if (text.contains("garbage") || text.contains("waste") || text.contains("dump") || text.contains("smell") || text.contains("plastic") || text.contains("sanitat")) {
            category = "SOLID_WASTE_AND_SANITATION";
            urgencyLevel = "MEDIUM";
            urgencyScore = 65;
            rootCause = "Unsegregated municipal waste pileup exceeding ward collection cadence, generating leachate and bio-aerosols.";
            departments = List.of("ENVIRONMENTAL", "MECHANICAL", "CSE_IT");
            problemStatement = "Develop an edge-AI vision-based optical waste sorter and smart bin volume monitor with dynamic collection routing.";
            disciplines = List.of("Computer Vision", "Pneumatic Ejection", "Environmental Microbiology");
        } else {
            category = "URBAN_INFRASTRUCTURE";
            urgencyLevel = "MEDIUM";
            urgencyScore = 60;
            rootCause = "General civic infrastructure wear requiring cross-disciplinary engineering inspection and remediation.";
            departments = List.of("CIVIL", "CSE_IT");
            problemStatement = "Formulate a digital-twin predictive maintenance telemetry solution for ward-level public assets.";
            disciplines = List.of("Systems Engineering", "IoT Telemetry", "Civil Infrastructure");
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("identifiedCategory", category);
        result.put("urgencyLevel", urgencyLevel);
        result.put("urgencyScore", urgencyScore);
        result.put("rootCauseAnalysis", rootCause);
        result.put("recommendedDepartments", departments);
        result.put("suggestedProblemStatement", problemStatement);
        result.put("requiredEngineeringDisciplines", disciplines);
        return result;
    }
}
