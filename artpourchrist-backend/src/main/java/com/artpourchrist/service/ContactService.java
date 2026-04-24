package com.artpourchrist.service;

import com.artpourchrist.dto.ContactDto;
import com.artpourchrist.model.ContactMessage;
import com.artpourchrist.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactRepository repository;

    @Value("${brevo.api-key:}")
    private String brevoApiKey;

    @Value("${app.contact.from.email:ichigamisenku07@gmail.com}")
    private String fromEmail;

    @Value("${app.contact.from.name:Art pour Christ}")
    private String fromName;

    private static final String[] RECIPIENTS = {
        "dolcenicky2004@icloud.com",
        "kevintsakem7@gmail.com",
        "Samuelitobasas@gmail.com"
    };

    public ContactDto.Response submit(ContactDto.Request request) {
        ContactMessage saved = repository.save(ContactMessage.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .subject(request.getSubject())
            .message(request.getMessage())
            .build());

        if (!brevoApiKey.isBlank()) {
            try {
                sendEmail(saved);
                log.info("Email de contact envoyé pour le message id={}", saved.getId());
            } catch (Exception e) {
                log.error("Échec de l'envoi de l'email de contact (message sauvegardé quand même) : {}", e.getMessage());
            }
        } else {
            log.warn("BREVO_API_KEY non configuré — email non envoyé pour le message id={}", saved.getId());
        }

        return toResponse(saved);
    }

    private void sendEmail(ContactMessage msg) throws Exception {
        String toJson = Arrays.stream(RECIPIENTS)
            .map(r -> "{\"email\":\"" + r + "\"}")
            .collect(Collectors.joining(",", "[", "]"));

        String subject = "[Art pour Christ] Nouveau message : " + msg.getSubject()
            + " — " + msg.getFirstName() + " " + msg.getLastName();

        String body = """
            {
              "sender": {"email": "%s", "name": "%s"},
              "to": %s,
              "replyTo": {"email": "%s"},
              "subject": "%s",
              "textContent": %s
            }
            """.formatted(
                fromEmail,
                fromName,
                toJson,
                msg.getEmail(),
                subject.replace("\"", "\\\""),
                toJsonString(buildEmailBody(msg))
            );

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
            .header("api-key", brevoApiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        HttpResponse<String> response = HttpClient.newHttpClient()
            .send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 400) {
            throw new RuntimeException("Brevo API error " + response.statusCode() + ": " + response.body());
        }
    }

    private String toJsonString(String text) {
        return "\"" + text
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t")
            + "\"";
    }

    private String buildEmailBody(ContactMessage msg) {
        return """
            Nouveau message de contact reçu sur artpourchrist.vercel.app
            ═══════════════════════════════════════════════════════════

            Prénom     : %s
            Nom        : %s
            Email      : %s
            Téléphone  : %s
            Sujet      : %s

            Message :
            ───────────────────────────────────────────────────────────
            %s
            ───────────────────────────────────────────────────────────

            Date de réception : %s

            (Vous pouvez répondre directement à cet email pour contacter %s %s)
            """.formatted(
                msg.getFirstName(),
                msg.getLastName(),
                msg.getEmail(),
                msg.getPhone() != null && !msg.getPhone().isBlank() ? msg.getPhone() : "Non renseigné",
                msg.getSubject(),
                msg.getMessage(),
                msg.getCreatedAt(),
                msg.getFirstName(),
                msg.getLastName()
            );
    }

    private ContactDto.Response toResponse(ContactMessage msg) {
        return ContactDto.Response.builder()
            .id(msg.getId())
            .firstName(msg.getFirstName())
            .lastName(msg.getLastName())
            .email(msg.getEmail())
            .phone(msg.getPhone())
            .subject(msg.getSubject())
            .message(msg.getMessage())
            .createdAt(msg.getCreatedAt())
            .build();
    }
}
