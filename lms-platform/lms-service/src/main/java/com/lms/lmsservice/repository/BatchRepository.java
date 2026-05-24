package com.lms.lmsservice.repository;

import com.lms.lmsservice.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByProcessId(Long processId);
}
