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

                // Expected format: LOB | Process | SubProcess | Batch
                String lob = currentRow.getCell(0) != null ? currentRow.getCell(0).getStringCellValue() : "";
                String processName = currentRow.getCell(1) != null ? currentRow.getCell(1).getStringCellValue() : "";
                String subProcess = currentRow.getCell(2) != null ? currentRow.getCell(2).getStringCellValue() : "";
                String batchName = currentRow.getCell(3) != null ? currentRow.getCell(3).getStringCellValue() : "";

                batches.add(saveBatch(lob, processName, subProcess, batchName));
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
                String lob = csvRecord.isMapped("LOB") ? csvRecord.get("LOB") : "";
                String processName = csvRecord.isMapped("Process") ? csvRecord.get("Process") : csvRecord.get(0);
                String subProcess = csvRecord.isMapped("SubProcess") ? csvRecord.get("SubProcess") : "";
                String batchName = csvRecord.isMapped("Batch") ? csvRecord.get("Batch") : csvRecord.get(1);

                batches.add(saveBatch(lob, processName, subProcess, batchName));
            }
        } catch (Exception e) {
            throw new RuntimeException("fail to parse CSV file: " + e.getMessage());
        }
        return batches;
    }

    private Batch saveBatch(String lob, String processName, String subProcess, String batchName) {
        Process process = processRepository.findAll().stream()
                .filter(p -> p.getName().equals(processName) &&
                             (p.getLineOfBusiness() == null || p.getLineOfBusiness().equals(lob)) &&
                             (p.getSubProcess() == null || p.getSubProcess().equals(subProcess)))
                .findFirst()
                .orElseGet(() -> {
                    Process p = new Process();
                    p.setLineOfBusiness(lob);
                    p.setName(processName);
                    p.setSubProcess(subProcess);
                    p.setDescription("Auto-created via Bulk Upload");
                    return processRepository.save(p);
                });

        Batch batch = new Batch();
        batch.setName(batchName);
        batch.setProcess(process);
        return batchRepository.save(batch);
    }
}
