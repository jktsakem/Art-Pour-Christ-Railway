package com.artpourchrist.controller;

import com.artpourchrist.dto.VideoDto;
import com.artpourchrist.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService service;

    @GetMapping
    public ResponseEntity<List<VideoDto.Response>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VideoDto.Response> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<VideoDto.Response> create(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam("video") MultipartFile videoFile,
            @RequestParam("thumbnail") MultipartFile thumbnailFile) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(title, description, category, videoFile, thumbnailFile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VideoDto.Response> update(
            @PathVariable String id,
            @RequestBody VideoDto.UpdateRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
