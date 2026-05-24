package com.lms.lmsservice.service;

import com.lms.lmsservice.model.Batch;
import com.lms.lmsservice.model.Process;
import com.lms.lmsservice.repository.BatchRepository;
import com.lms.lmsservice.repository.ProcessRepository;
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

@Service
public class BulkUploadService {

    private final ProcessRepository processRepository;
    private final BatchRepository batchRepository;

    public BulkUploadService(ProcessRepository processRepository, BatchRepository batchRepository) {
        this.processRepository = processRepository;
        this.batchRepository = batchRepository;
    }

    public List<Batch> processExcel(MultipartFile file) {
        List<Batch> batches = new ArrayList<>();
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

                String processName = currentRow.getCell(0).getStringCellValue();
                String batchName = currentRow.getCell(1).getStringCellValue();

                batches.add(saveBatch(processName, batchName));
            }
        } catch (Exception e) {
            throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
        }
        return batches;
    }

    public List<Batch> processCsv(MultipartFile file) {
        List<Batch> batches = new ArrayList<>();
        try (BufferedReader fileReader = new BufferedReader(new InputStreamReader(file.getInputStream(), "UTF-8"));
             CSVParser csvParser = new CSVParser(fileReader,
                     CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim())) {

            Iterable<CSVRecord> csvRecords = csvParser.getRecords();

            for (CSVRecord csvRecord : csvRecords) {
                String processName = csvRecord.get("Process");
                String batchName = csvRecord.get("Batch");

                batches.add(saveBatch(processName, batchName));
            }
        } catch (Exception e) {
            throw new RuntimeException("fail to parse CSV file: " + e.getMessage());
        }
        return batches;
    }

    private Batch saveBatch(String processName, String batchName) {
        // Simple logic for PoC: if process doesn't exist by name (using first logic), create it.
        // Here we just fetch first for demo, or create new.
        Process process = processRepository.findAll().stream()
                .filter(p -> p.getName().equals(processName))
                .findFirst()
                .orElseGet(() -> {
                    Process p = new Process();
                    p.setName(processName);
                    p.setDescription("Auto-created process");
                    return processRepository.save(p);
                });

        Batch batch = new Batch();
        batch.setName(batchName);
        batch.setProcess(process);
        return batchRepository.save(batch);
    }
}
