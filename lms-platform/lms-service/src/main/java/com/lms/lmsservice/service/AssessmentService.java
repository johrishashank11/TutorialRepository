package com.lms.lmsservice.service;

import com.lms.lmsservice.dto.TestSubmissionRequest;
import com.lms.lmsservice.model.Question;
import com.lms.lmsservice.model.Test;
import com.lms.lmsservice.repository.QuestionRepository;
import com.lms.lmsservice.repository.TestRepository;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AssessmentService {

    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;

    public AssessmentService(TestRepository testRepository, QuestionRepository questionRepository) {
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
    }

    public Test createTest(Test test) {
        if (test.getQuestions() != null) {
            test.getQuestions().forEach(q -> q.setTest(test));
        }
        return testRepository.save(test);
    }

    public double gradeSubmission(TestSubmissionRequest request) {
        Test test = testRepository.findById(request.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found"));

        if (!"MCQ".equals(test.getType())) {
            // For EMAIL_SIMULATOR or other manual formats, the logic differs.
            // Placeholder for AI/Manual logic.
            return 0.0;
        }

        int correctAnswers = 0;
        Map<Long, String> traineeAnswers = request.getAnswers();

        for (Question question : test.getQuestions()) {
            String submittedAnswer = traineeAnswers.get(question.getId());
            if (submittedAnswer != null && submittedAnswer.equalsIgnoreCase(question.getCorrectAnswer())) {
                correctAnswers++;
            }
        }

        double score = (double) correctAnswers / test.getQuestions().size() * 100;

        // Save test result logic here...
        // For PoC we just return the score.

        return score;
    }
}
