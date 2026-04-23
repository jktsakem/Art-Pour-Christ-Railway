package com.artpourchrist.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

public class ContactDto {

    @Data
    public static class Request {

        @NotBlank(message = "Le prénom est obligatoire")
        private String firstName;

        @NotBlank(message = "Le nom est obligatoire")
        private String lastName;

        @NotBlank(message = "L'email est obligatoire")
        @Email(message = "Email invalide")
        private String email;

        private String phone;

        @NotBlank(message = "Le sujet est obligatoire")
        private String subject;

        @NotBlank(message = "Le message est obligatoire")
        @Size(max = 2000, message = "Le message ne peut pas dépasser 2000 caractères")
        private String message;
    }

    @Data
    @Builder
    public static class Response {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String subject;
        private String message;
        private LocalDateTime createdAt;
    }
}
