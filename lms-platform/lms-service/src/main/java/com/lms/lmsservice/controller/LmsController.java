package com.lms.lmsservice.controller;

import com.lms.entity.Batch;
import com.lms.entity.Content;
import com.lms.entity.Course;
import com.lms.entity.Process;
import com.lms.lmsservice.constant.MessageConstants;
import com.lms.repository.BatchRepository;
import com.lms.repository.ContentRepository;
import com.lms.repository.CourseRepository;
import com.lms.repository.ProcessRepository;
import com.lms.lmsservice.service.FileStorageService;
import com.lms.model.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/lms")
public class LmsController {

    private final ProcessRepository processRepository;
    private final BatchRepository batchRepository;
    private final CourseRepository courseRepository;
    private final ContentRepository contentRepository;
    private final FileStorageService fileStorageService;

    public LmsController(ProcessRepository processRepository, BatchRepository batchRepository,
                         CourseRepository courseRepository, ContentRepository contentRepository,
                         FileStorageService fileStorageService) {
        this.processRepository = processRepository;
        this.batchRepository = batchRepository;
        this.courseRepository = courseRepository;
        this.contentRepository = contentRepository;
        this.fileStorageService = fileStorageService;
    }

    // Processes
    @PostMapping("/processes")
    public ResponseEntity<ApiResponse<Process>> createProcess(@RequestBody Process process) {
        Process saved = processRepository.save(process);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, MessageConstants.PROCESS_CREATED, saved));
    }

    @GetMapping("/processes")
    public ResponseEntity<ApiResponse<List<Process>>> getAllProcesses() {
        List<Process> processes = processRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, MessageConstants.PROCESS_FETCHED, processes));
    }

    // Batches
    @PostMapping("/processes/{processId}/batches")
    public ResponseEntity<ApiResponse<Batch>> createBatch(@PathVariable Long processId, @RequestBody Batch batch) {
        Process process = processRepository.findById(processId)
                .orElseThrow(() -> new RuntimeException("Process not found"));
        batch.setProcess(process);
        Batch saved = batchRepository.save(batch);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, MessageConstants.BATCH_CREATED, saved));
    }

    @GetMapping("/batches")
    public ResponseEntity<ApiResponse<List<Batch>>> getAllBatches() {
        List<Batch> batches = batchRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, MessageConstants.BATCH_FETCHED, batches));
    }

    @PostMapping("/batches/{batchId}/courses/{courseId}")
    public ResponseEntity<ApiResponse<Batch>> assignCourseToBatch(@PathVariable Long batchId, @PathVariable Long courseId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (batch.getCourses() == null) {
            batch.setCourses(new ArrayList<>());
        }

        if(!batch.getCourses().contains(course)){
            batch.getCourses().add(course);
        }

        Batch updatedBatch = batchRepository.save(batch);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, MessageConstants.BATCH_ASSIGNED, updatedBatch));
    }

    // Courses
    @PostMapping("/courses")
    public ResponseEntity<ApiResponse<Course>> createCourse(@RequestBody Course course) {
        Course saved = courseRepository.save(course);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, MessageConstants.COURSE_CREATED, saved));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<ApiResponse<Course>> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setActive(courseDetails.isActive());

        Course updatedCourse = courseRepository.save(course);
        return ResponseEntity.ok(new ApiResponse<>(true, MessageConstants.COURSE_UPDATED, updatedCourse));
    }

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<Course>>> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return ResponseEntity.ok(new ApiResponse<>(true, MessageConstants.COURSE_FETCHED, courses));
    }

    // Contents
    @PostMapping("/courses/{courseId}/contents")
    public ResponseEntity<ApiResponse<Content>> uploadContent(@PathVariable Long courseId,
                                                 @RequestParam("file") MultipartFile file,
                                                 @RequestParam("fileType") String fileType) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(fileName)
                .toUriString();

        Content content = new Content();
        content.setFileName(fileName);
        content.setFileType(fileType);
        content.setFilePath(fileDownloadUri);
        content.setCourse(course);

        Content savedContent = contentRepository.save(content);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, MessageConstants.CONTENT_UPLOADED, savedContent));
    }
}
