package com.artpourchrist.service;

import com.artpourchrist.dto.ContactDto;
import com.artpourchrist.model.ContactMessage;
import com.artpourchrist.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final ContactRepository repository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.contact.from:noreply@artpourchrist.com}")
    private String fromEmail;

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

        if (mailSender != null) {
            try {
                sendEmail(saved);
                log.info("Email de contact envoyé pour le message id={}", saved.getId());
            } catch (Exception e) {
                log.error("Échec de l'envoi de l'email de contact (message sauvegardé quand même) : {}", e.getMessage());
            }
        } else {
            log.warn("JavaMailSender non configuré — email non envoyé pour le message id={}", saved.getId());
        }

        return toResponse(saved);
    }

    private void sendEmail(ContactMessage msg) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom(fromEmail);
        email.setReplyTo(msg.getEmail());
        email.setTo(RECIPIENTS);
        email.setSubject("[Art pour Christ] Nouveau message : " + msg.getSubject()
            + " — " + msg.getFirstName() + " " + msg.getLastName());
        email.setText(buildEmailBody(msg));
        mailSender.send(email);
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
