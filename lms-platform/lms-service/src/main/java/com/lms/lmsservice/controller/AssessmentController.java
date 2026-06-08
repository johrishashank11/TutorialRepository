package com.lms.lmsservice.controller;

import com.lms.entity.Test;
import com.lms.lmsservice.constant.MessageConstants;
import com.lms.lmsservice.dto.TestSubmissionRequest;
import com.lms.lmsservice.service.AssessmentService;
import com.lms.model.ApiResponse;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ApiResponse<Test>> createTest(@PathVariable Long courseId, @RequestBody Test test) {
        Test saved = assessmentService.createTest(courseId, test);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, MessageConstants.TEST_CREATED, saved));
    }

    @PostMapping("/courses/{courseId}/tests/upload")
    public ResponseEntity<ApiResponse<Test>> uploadTestQuestions(
            @PathVariable Long courseId,
            @RequestParam("title") String title,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file) {
        Test saved = assessmentService.uploadTestQuestions(courseId, title, type, file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, MessageConstants.TEST_CREATED, saved));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<Double>> submitTest(@RequestBody TestSubmissionRequest request) {
        double score = assessmentService.gradeSubmission(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, MessageConstants.SUBMISSION_GRADED, score));
    }

    @GetMapping("/tests")
    public ResponseEntity<ApiResponse<List<Test>>> getAllTests() {
        List<Test> tests = assessmentService.getAllTests();
        return ResponseEntity.ok(new ApiResponse<>(true, MessageConstants.TEST_FETCHED, tests));
    }
}
