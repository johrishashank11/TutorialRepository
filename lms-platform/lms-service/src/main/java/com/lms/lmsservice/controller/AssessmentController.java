package com.lms.lmsservice.controller;

import com.lms.lmsservice.dto.TestSubmissionRequest;
import com.lms.lmsservice.model.Test;
import com.lms.lmsservice.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/lms/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping("/courses/{courseId}/tests")
    public ResponseEntity<Test> createTest(@PathVariable Long courseId, @RequestBody Test test) {
        return ResponseEntity.ok(assessmentService.createTest(courseId, test));
    }

    @PostMapping("/courses/{courseId}/tests/upload")
    public ResponseEntity<Test> uploadTestQuestions(
            @PathVariable Long courseId,
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(assessmentService.uploadTestQuestions(courseId, title, type, file));
    }

    @PostMapping("/submit")
    public ResponseEntity<Double> submitTest(@RequestBody TestSubmissionRequest request) {
        double score = assessmentService.gradeSubmission(request);
        return ResponseEntity.ok(score);
    }

    @GetMapping("/tests")
    public ResponseEntity<List<Test>> getAllTests() {
        return ResponseEntity.ok(assessmentService.getAllTests());
    }
}
