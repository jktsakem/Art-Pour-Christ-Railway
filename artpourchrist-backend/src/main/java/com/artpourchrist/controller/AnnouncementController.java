package com.artpourchrist.controller;

import com.artpourchrist.dto.AnnouncementDto;
import com.artpourchrist.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService service;

    @GetMapping
    public ResponseEntity<List<AnnouncementDto.Response>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDto.Response> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<AnnouncementDto.Response> create(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("date") String date,
            @RequestParam(value = "time", required = false) String time,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam("category") String category,
            @RequestParam(value = "featured", defaultValue = "false") boolean featured,
            @RequestParam(value = "linkUrl", required = false) String linkUrl,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(title, description, date, time, location,
                        category, featured, linkUrl, image));
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<AnnouncementDto.Response> update(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("date") String date,
            @RequestParam(value = "time", required = false) String time,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam("category") String category,
            @RequestParam(value = "featured", defaultValue = "false") boolean featured,
            @RequestParam(value = "linkUrl", required = false) String linkUrl,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        return ResponseEntity.ok(service.update(id, title, description, date, time, location,
                category, featured, linkUrl, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
