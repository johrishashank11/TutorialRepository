package com.lms.lmsservice.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "batches")
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private Process process;

    @ManyToMany
    @JoinTable(
        name = "batch_courses",
        joinColumns = @JoinColumn(name = "batch_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private List<Course> courses;

    // A simple representation of trainees in a batch by ID from auth-service
    @ElementCollection
    private List<Long> traineeIds;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Process getProcess() { return process; }
    public void setProcess(Process process) { this.process = process; }
    public List<Course> getCourses() { return courses; }
    public void setCourses(List<Course> courses) { this.courses = courses; }
    public List<Long> getTraineeIds() { return traineeIds; }
    public void setTraineeIds(List<Long> traineeIds) { this.traineeIds = traineeIds; }
}
