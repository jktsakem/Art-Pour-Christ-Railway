package com.artpourchrist.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

public class VideoDto {

    @Data
    public static class UpdateRequest {
        private String title;
        private String description;
        private String category;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String title;
        private String description;
        private String category;
        private String url;
        private String thumbnail;
        private String createdAt;
    }
}
