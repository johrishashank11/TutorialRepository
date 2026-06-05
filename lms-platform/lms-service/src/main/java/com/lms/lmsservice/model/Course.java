package com.lms.lmsservice.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean active = true;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Content> contents;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Test> tests;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public List<Content> getContents() { return contents; }
    public void setContents(List<Content> contents) { this.contents = contents; }
    public List<Test> getTests() { return tests; }
    public void setTests(List<Test> tests) { this.tests = tests; }
}
