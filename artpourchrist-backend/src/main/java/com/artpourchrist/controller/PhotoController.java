package com.artpourchrist.controller;

import com.artpourchrist.dto.PhotoDto;
import com.artpourchrist.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService service;

    @GetMapping
    public ResponseEntity<List<PhotoDto.Response>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotoDto.Response> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<PhotoDto.Response> create(
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam("photo") MultipartFile photoFile) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.create(title, description, category, photoFile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PhotoDto.Response> update(
            @PathVariable String id,
            @RequestBody PhotoDto.UpdateRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
