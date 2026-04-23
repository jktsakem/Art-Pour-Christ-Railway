package com.artpourchrist.service;

import com.artpourchrist.dto.DashboardDto;
import com.artpourchrist.model.Activity;
import com.artpourchrist.repository.AnnouncementRepository;
import com.artpourchrist.repository.PhotoRepository;
import com.artpourchrist.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PhotoRepository photoRepository;
    private final VideoRepository videoRepository;
    private final AnnouncementRepository announcementRepository;
    private final ActivityService activityService;

    public DashboardDto getStats() {
        List<Activity> recent = activityService.getRecent(10);

        List<DashboardDto.ActivityItem> activityItems = recent.stream()
                .map(a -> DashboardDto.ActivityItem.builder()
                        .title(a.getTitle())
                        .type(a.getType().name())
                        .action(a.getAction().name())
                        .date(a.getDate().toString())
                        .build())
                .toList();

        return DashboardDto.builder()
                .totalPhotos(photoRepository.count())
                .totalVideos(videoRepository.count())
                .totalAnnouncements(announcementRepository.count())
                .recentActivity(activityItems)
                .build();
    }
}
