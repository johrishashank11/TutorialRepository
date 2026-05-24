package com.lms.lmsservice.controller;

import com.lms.lmsservice.model.Batch;
import com.lms.lmsservice.service.BulkUploadService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/lms/bulk-upload")
public class BulkUploadController {

    private final BulkUploadService bulkUploadService;

    public BulkUploadController(BulkUploadService bulkUploadService) {
        this.bulkUploadService = bulkUploadService;
    }

    @PostMapping("/batches")
    public ResponseEntity<List<Batch>> uploadBatches(@RequestParam("file") MultipartFile file) {
        String filename = file.getOriginalFilename();
        List<Batch> savedBatches;

        if (filename != null && filename.endsWith(".csv")) {
            savedBatches = bulkUploadService.processCsv(file);
        } else if (filename != null && (filename.endsWith(".xlsx") || filename.endsWith(".xls"))) {
            savedBatches = bulkUploadService.processExcel(file);
        } else {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(savedBatches);
    }
}
