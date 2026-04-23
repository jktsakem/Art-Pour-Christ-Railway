package com.artpourchrist.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class AuthDto {

    @Data
    public static class LoginRequest {
        @Email(message = "Email invalide")
        @NotBlank(message = "Email requis")
        private String email;

        @NotBlank(message = "Mot de passe requis")
        private String password;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private String email;
        private String role;

        public LoginResponse(String token, String email, String role) {
            this.token = token;
            this.email = email;
            this.role = role;
        }
    }
}
