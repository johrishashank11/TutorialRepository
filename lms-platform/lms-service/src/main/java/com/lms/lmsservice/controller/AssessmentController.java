package com.lms.lmsservice.controller;

import com.lms.lmsservice.dto.TestSubmissionRequest;
import com.lms.lmsservice.model.Test;
import com.lms.lmsservice.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lms/assessments")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @PostMapping("/tests")
    public ResponseEntity<Test> createTest(@RequestBody Test test) {
        return ResponseEntity.ok(assessmentService.createTest(test));
    }

    @PostMapping("/submit")
    public ResponseEntity<Double> submitTest(@RequestBody TestSubmissionRequest request) {
        double score = assessmentService.gradeSubmission(request);
        return ResponseEntity.ok(score);
    }
}
