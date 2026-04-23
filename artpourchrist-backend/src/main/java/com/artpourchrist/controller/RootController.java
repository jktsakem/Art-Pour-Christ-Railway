package com.artpourchrist.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/")
public class RootController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
            "app", "Art pour Christ - MEEC Centre",
            "status", "running",
            "version", "1.0.0",
            "api", "/api",
            "endpoints", Map.of(
                "auth",          "/api/auth/login",
                "announcements", "/api/announcements",
                "photos",        "/api/photos",
                "videos",        "/api/videos",
                "dashboard",     "/api/dashboard/stats"
            )
        ));
    }

    @GetMapping("/api")
    public ResponseEntity<Map<String, String>> api() {
        return ResponseEntity.ok(Map.of(
            "message", "Art pour Christ API is running",
            "docs",    "See README.md for full endpoint list"
        ));
    }
}