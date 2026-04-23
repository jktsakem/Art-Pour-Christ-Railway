package com.artpourchrist.service;

import com.artpourchrist.dto.VideoDto;
import com.artpourchrist.model.Activity;
import com.artpourchrist.model.Video;
import com.artpourchrist.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository repository;
    private final FileStorageService fileStorageService;
    private final ActivityService activityService;

    public List<VideoDto.Response> getAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toResponse).toList();
    }

    public VideoDto.Response getById(String id) {
        return toResponse(findById(id));
    }

    public VideoDto.Response create(String title, String description, String category,
                                    MultipartFile videoFile, MultipartFile thumbnailFile) {
        String videoPath = fileStorageService.storeVideo(videoFile, "videos");
        String thumbnailPath = fileStorageService.storeThumbnail(thumbnailFile, "thumbnails");

        Video video = Video.builder()
                .title(title)
                .description(description)
                .category(category)
                .filename(videoPath)
                .url(fileStorageService.getUrl(videoPath))
                .thumbnailFilename(thumbnailPath)
                .thumbnail(fileStorageService.getUrl(thumbnailPath))
                .build();

        video = repository.save(video);
        activityService.log(video.getTitle(), Activity.ActivityType.video, Activity.ActivityAction.created);
        return toResponse(video);
    }

    public VideoDto.Response update(String id, VideoDto.UpdateRequest req) {
        Video video = findById(id);
        if (req.getTitle() != null) video.setTitle(req.getTitle());
        if (req.getDescription() != null) video.setDescription(req.getDescription());
        if (req.getCategory() != null) video.setCategory(req.getCategory());

        video = repository.save(video);
        activityService.log(video.getTitle(), Activity.ActivityType.video, Activity.ActivityAction.updated);
        return toResponse(video);
    }

    public void delete(String id) {
        Video video = findById(id);
        fileStorageService.delete(video.getFilename());
        fileStorageService.delete(video.getThumbnailFilename());
        activityService.log(video.getTitle(), Activity.ActivityType.video, Activity.ActivityAction.deleted);
        repository.deleteById(id);
    }

    private Video findById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vidéo non trouvée: " + id));
    }

    private VideoDto.Response toResponse(Video v) {
        return VideoDto.Response.builder()
                .id(v.getId())
                .title(v.getTitle())
                .description(v.getDescription())
                .category(v.getCategory())
                .url(v.getUrl())
                .thumbnail(v.getThumbnail())
                .createdAt(v.getCreatedAt() != null ? v.getCreatedAt().toString() : null)
                .build();
    }
}
