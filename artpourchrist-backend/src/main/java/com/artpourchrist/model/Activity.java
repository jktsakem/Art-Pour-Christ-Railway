package com.artpourchrist.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ActivityType type;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ActivityAction action;

    @Builder.Default
    private LocalDateTime date = LocalDateTime.now();

    public enum ActivityType {
        photo, video, announcement
    }

    public enum ActivityAction {
        created, updated, deleted
    }
}
