package com.lms.lmsservice.controller;

import com.lms.entity.Batch;
import com.lms.lmsservice.constant.MessageConstants;
import com.lms.lmsservice.service.BulkUploadService;
import com.lms.model.ApiResponse;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<ApiResponse<List<Batch>>> uploadBatches(@RequestParam("file") MultipartFile file) {
        String filename = file.getOriginalFilename();
        List<Batch> savedBatches;

        if (filename != null && filename.endsWith(".csv")) {
            savedBatches = bulkUploadService.processCsv(file);
        } else if (filename != null && (filename.endsWith(".xlsx") || filename.endsWith(".xls"))) {
            savedBatches = bulkUploadService.processExcel(file);
        } else {
            throw new RuntimeException("Unsupported file format");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, MessageConstants.BATCH_CREATED, savedBatches));
    }
}
