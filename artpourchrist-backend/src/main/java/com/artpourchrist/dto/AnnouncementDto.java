package com.artpourchrist.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

public class AnnouncementDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String title;
        private String description;
        private String date;
        private String time;
        private String location;
        private String category;
        private boolean featured;
        private String imageUrl;
        private String linkUrl;
        private String createdAt;
    }
}
