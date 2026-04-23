package com.artpourchrist.config;

import com.artpourchrist.model.User;
import com.artpourchrist.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = User.builder()
                        .email(adminEmail)
                        .password(encoder.encode(adminPassword))
                        .role(User.Role.SUPER_ADMIN)
                        .build();
                userRepository.save(admin);
                log.info("✅ Admin created: {}", adminEmail);
            } else {
                log.info("ℹ️  Admin already exists: {}", adminEmail);
            }
        };
    }
}
