package com.artpourchrist.service;

import com.artpourchrist.dto.AnnouncementDto;
import com.artpourchrist.model.Activity;
import com.artpourchrist.model.Announcement;
import com.artpourchrist.repository.AnnouncementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository repository;
    private final ActivityService activityService;
    private final FileStorageService fileStorageService;

    public List<AnnouncementDto.Response> getAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public AnnouncementDto.Response getById(String id) {
        return toResponse(findById(id));
    }

    public AnnouncementDto.Response create(String title, String description, String date,
                                           String time, String location, String category,
                                           boolean featured, String linkUrl, MultipartFile image) {
        String imageFilename = null;
        String imageUrl = null;
        if (image != null && !image.isEmpty()) {
            imageFilename = fileStorageService.storeImage(image, "announcements");
            imageUrl = fileStorageService.getUrl(imageFilename);
        }

        Announcement announcement = Announcement.builder()
                .title(title)
                .description(description)
                .date(date)
                .time(time)
                .location(location)
                .category(category)
                .featured(featured)
                .linkUrl(linkUrl)
                .imageFilename(imageFilename)
                .imageUrl(imageUrl)
                .build();

        announcement = repository.save(announcement);
        activityService.log(announcement.getTitle(), Activity.ActivityType.announcement, Activity.ActivityAction.created);
        return toResponse(announcement);
    }

    public AnnouncementDto.Response update(String id, String title, String description, String date,
                                           String time, String location, String category,
                                           boolean featured, String linkUrl, MultipartFile image) {
        Announcement announcement = findById(id);

        announcement.setTitle(title);
        announcement.setDescription(description);
        announcement.setDate(date);
        announcement.setTime(time);
        announcement.setLocation(location);
        announcement.setCategory(category);
        announcement.setFeatured(featured);
        announcement.setLinkUrl(linkUrl);

        // Remplacer l'image seulement si une nouvelle est fournie
        if (image != null && !image.isEmpty()) {
            fileStorageService.delete(announcement.getImageFilename());
            String newFilename = fileStorageService.storeImage(image, "announcements");
            announcement.setImageFilename(newFilename);
            announcement.setImageUrl(fileStorageService.getUrl(newFilename));
        }

        announcement = repository.save(announcement);
        activityService.log(announcement.getTitle(), Activity.ActivityType.announcement, Activity.ActivityAction.updated);
        return toResponse(announcement);
    }

    public void delete(String id) {
        Announcement announcement = findById(id);
        fileStorageService.delete(announcement.getImageFilename());
        activityService.log(announcement.getTitle(), Activity.ActivityType.announcement, Activity.ActivityAction.deleted);
        repository.deleteById(id);
    }

    private Announcement findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Annonce non trouvée: " + id));
    }

    private AnnouncementDto.Response toResponse(Announcement a) {
        return AnnouncementDto.Response.builder()
                .id(a.getId())
                .title(a.getTitle())
                .description(a.getDescription())
                .date(a.getDate())
                .time(a.getTime())
                .location(a.getLocation())
                .category(a.getCategory())
                .featured(a.isFeatured())
                .imageUrl(a.getImageUrl())
                .linkUrl(a.getLinkUrl())
                .createdAt(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null)
                .build();
    }
}
