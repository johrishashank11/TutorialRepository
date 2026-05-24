package com.lms.lmsservice.dto;

import java.util.Map;

public class TestSubmissionRequest {
    private Long traineeId;
    private Long testId;
    private Map<Long, String> answers; // Question ID to Selected Option mapping

    public Long getTraineeId() { return traineeId; }
    public void setTraineeId(Long traineeId) { this.traineeId = traineeId; }
    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }
    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}
