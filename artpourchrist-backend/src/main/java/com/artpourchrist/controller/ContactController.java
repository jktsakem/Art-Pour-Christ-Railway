package com.artpourchrist.controller;

import com.artpourchrist.dto.ContactDto;
import com.artpourchrist.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService service;

    @PostMapping
    public ResponseEntity<ContactDto.Response> submit(@Valid @RequestBody ContactDto.Request request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.submit(request));
    }
}
