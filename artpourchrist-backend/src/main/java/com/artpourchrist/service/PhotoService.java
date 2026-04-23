package com.artpourchrist.service;

import com.artpourchrist.dto.PhotoDto;
import com.artpourchrist.model.Activity;
import com.artpourchrist.model.Photo;
import com.artpourchrist.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository repository;
    private final FileStorageService fileStorageService;
    private final ActivityService activityService;

    public List<PhotoDto.Response> getAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public PhotoDto.Response getById(String id) {
        return toResponse(findById(id));
    }

    public PhotoDto.Response create(String title, String description, String category,
                                    MultipartFile imageFile) {
        String relativePath = fileStorageService.storeImage(imageFile, "photos");
        String url = fileStorageService.getUrl(relativePath);

        Photo photo = Photo.builder()
                .title(title)
                .description(description)
                .category(category)
                .filename(relativePath)
                .url(url)
                .build();

        photo = repository.save(photo);
        activityService.log(photo.getTitle(), Activity.ActivityType.photo, Activity.ActivityAction.created);
        return toResponse(photo);
    }

    public PhotoDto.Response update(String id, PhotoDto.UpdateRequest req) {
        Photo photo = findById(id);
        if (req.getTitle() != null) photo.setTitle(req.getTitle());
        if (req.getDescription() != null) photo.setDescription(req.getDescription());
        if (req.getCategory() != null) photo.setCategory(req.getCategory());

        photo = repository.save(photo);
        activityService.log(photo.getTitle(), Activity.ActivityType.photo, Activity.ActivityAction.updated);
        return toResponse(photo);
    }

    public void delete(String id) {
        Photo photo = findById(id);
        fileStorageService.delete(photo.getFilename());
        activityService.log(photo.getTitle(), Activity.ActivityType.photo, Activity.ActivityAction.deleted);
        repository.deleteById(id);
    }

    private Photo findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Photo non trouvée: " + id));
    }

    private PhotoDto.Response toResponse(Photo p) {
        return PhotoDto.Response.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .category(p.getCategory())
                .url(p.getUrl())
                .createdAt(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null)
                .build();
    }
}
