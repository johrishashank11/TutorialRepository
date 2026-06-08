package com.lms.lmsservice.service;

import com.lms.lmsservice.dto.TestSubmissionRequest;
import com.lms.lmsservice.model.Course;
import com.lms.lmsservice.model.Question;
import com.lms.lmsservice.model.Test;
import com.lms.lmsservice.repository.CourseRepository;
import com.lms.lmsservice.repository.QuestionRepository;
import com.lms.lmsservice.repository.TestRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
public class AssessmentService {

    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;
    private final CourseRepository courseRepository;

    public AssessmentService(TestRepository testRepository, QuestionRepository questionRepository, CourseRepository courseRepository) {
        this.testRepository = testRepository;
        this.questionRepository = questionRepository;
        this.courseRepository = courseRepository;
    }

    public Test createTest(Long courseId, Test test) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        test.setCourse(course);

        if (test.getQuestions() != null) {
            test.getQuestions().forEach(q -> q.setTest(test));
        }
        return testRepository.save(test);
    }

    public Test uploadTestQuestions(Long courseId, String title, String type, MultipartFile file) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Test test = new Test();
        test.setTitle(title);
        test.setType(type);
        test.setCourse(course);
        test.setQuestions(new ArrayList<>());

        String filename = file.getOriginalFilename();
        try {
            if (filename != null && (filename.endsWith(".xlsx") || filename.endsWith(".xls"))) {
                parseExcelQuestions(file, test);
            } else if (filename != null && filename.endsWith(".csv")) {
                parseCsvQuestions(file, test);
            } else {
                throw new RuntimeException("Unsupported file format for questions upload");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse test questions: " + e.getMessage());
        }

        return testRepository.save(test);
    }

    private void parseExcelQuestions(MultipartFile file, Test test) throws Exception {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue; // Skip header
                }

                // Expected: QuestionText | Options (comma separated JSON string logic) | CorrectAnswer
                String text = currentRow.getCell(0) != null ? currentRow.getCell(0).getStringCellValue() : "";
                String options = currentRow.getCell(1) != null ? currentRow.getCell(1).getStringCellValue() : "";
                String correctAnswer = currentRow.getCell(2) != null ? currentRow.getCell(2).getStringCellValue() : "";

                Question q = new Question();
                q.setText(text);
                q.setOptions(options);
                q.setCorrectAnswer(correctAnswer);
                q.setTest(test);
                test.getQuestions().add(q);
            }
        }
    }

    private void parseCsvQuestions(MultipartFile file, Test test) throws Exception {
        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
             CSVParser csvParser = new CSVParser(fileReader,
                     CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                String text = csvRecord.isMapped("Question") ? csvRecord.get("Question") : csvRecord.get(0);
                String options = csvRecord.isMapped("Options") ? csvRecord.get("Options") : csvRecord.get(1);
                String correctAnswer = csvRecord.isMapped("CorrectAnswer") ? csvRecord.get("CorrectAnswer") : csvRecord.get(2);

                Question q = new Question();
                q.setText(text);
                q.setOptions(options);
                q.setCorrectAnswer(correctAnswer);
                q.setTest(test);
                test.getQuestions().add(q);
            }
        }
    }

    public double gradeSubmission(TestSubmissionRequest request) {
        Test test = testRepository.findById(request.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found"));

        if (!"QUIZ".equalsIgnoreCase(test.getType()) && !"MCQ".equalsIgnoreCase(test.getType())) {
            // For EMAIL_SIMULATOR or other manual formats, logic differs.
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

        double score = test.getQuestions().isEmpty() ? 0 : (double) correctAnswers / test.getQuestions().size() * 100;
        return score;
    }

    public List<Test> getAllTests() {
        return testRepository.findAll();
    }
}
