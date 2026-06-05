package com.lms.lmsservice.controller;

import com.lms.lmsservice.model.Batch;
import com.lms.lmsservice.model.Content;
import com.lms.lmsservice.model.Course;
import com.lms.lmsservice.model.Process;
import com.lms.lmsservice.repository.BatchRepository;
import com.lms.lmsservice.repository.ContentRepository;
import com.lms.lmsservice.repository.CourseRepository;
import com.lms.lmsservice.repository.ProcessRepository;
import com.lms.lmsservice.service.FileStorageService;
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
    public Process createProcess(@RequestBody Process process) {
        return processRepository.save(process);
    }

    @GetMapping("/processes")
    public List<Process> getAllProcesses() {
        return processRepository.findAll();
    }

    // Batches
    @PostMapping("/processes/{processId}/batches")
    public Batch createBatch(@PathVariable Long processId, @RequestBody Batch batch) {
        Process process = processRepository.findById(processId)
                .orElseThrow(() -> new RuntimeException("Process not found"));
        batch.setProcess(process);
        return batchRepository.save(batch);
    }

    @GetMapping("/batches")
    public List<Batch> getAllBatches() {
        return batchRepository.findAll();
    }

    @PostMapping("/batches/{batchId}/courses/{courseId}")
    public ResponseEntity<Batch> assignCourseToBatch(@PathVariable Long batchId, @PathVariable Long courseId) {
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
        return ResponseEntity.ok(updatedBatch);
    }

    // Courses
    @PostMapping("/courses")
    public Course createCourse(@RequestBody Course course) {
        return courseRepository.save(course);
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setActive(courseDetails.isActive());

        Course updatedCourse = courseRepository.save(course);
        return ResponseEntity.ok(updatedCourse);
    }

    @GetMapping("/courses")
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Contents
    @PostMapping("/courses/{courseId}/contents")
    public ResponseEntity<Content> uploadContent(@PathVariable Long courseId,
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

        return ResponseEntity.ok(savedContent);
    }
}
