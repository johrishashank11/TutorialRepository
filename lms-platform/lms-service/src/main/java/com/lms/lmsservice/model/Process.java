package com.lms.lmsservice.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "processes")
public class Process {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lineOfBusiness;
    private String name; // Represents Process Name
    private String subProcess;

    private String description;

    @OneToMany(mappedBy = "process", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Batch> batches;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLineOfBusiness() { return lineOfBusiness; }
    public void setLineOfBusiness(String lineOfBusiness) { this.lineOfBusiness = lineOfBusiness; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSubProcess() { return subProcess; }
    public void setSubProcess(String subProcess) { this.subProcess = subProcess; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<Batch> getBatches() { return batches; }
    public void setBatches(List<Batch> batches) { this.batches = batches; }
}
