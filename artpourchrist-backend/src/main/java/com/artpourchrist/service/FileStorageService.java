package com.artpourchrist.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final Set<String> ALLOWED_VIDEO_TYPES = Set.of(
            "video/mp4", "video/webm", "video/ogg", "video/quicktime"
    );
    private static final Set<String> ALLOWED_THUMBNAIL_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp"
    );

    private final Cloudinary cloudinary;

    public FileStorageService() {
        // Lit automatiquement la variable d'environnement CLOUDINARY_URL
        this.cloudinary = new Cloudinary();
    }

    public String storeImage(MultipartFile file, String subfolder) {
        validateContentType(file, ALLOWED_IMAGE_TYPES);
        return upload(file, subfolder, "image");
    }

    public String storeVideo(MultipartFile file, String subfolder) {
        validateContentType(file, ALLOWED_VIDEO_TYPES);
        return upload(file, subfolder, "video");
    }

    public String storeThumbnail(MultipartFile file, String subfolder) {
        validateContentType(file, ALLOWED_THUMBNAIL_TYPES);
        return upload(file, subfolder, "image");
    }

    public String getUrl(String url) {
        return url;
    }

    public void delete(String url) {
        if (url == null || url.isEmpty()) return;
        try {
            String publicId = extractPublicId(url);
            String resourceType = url.contains("/video/upload/") ? "video" : "image";
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", resourceType));
        } catch (Exception e) {
            log.warn("Impossible de supprimer le fichier Cloudinary: {}", url);
        }
    }

    private String upload(MultipartFile file, String subfolder, String resourceType) {
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "artpourchrist/" + subfolder,
                            "resource_type", resourceType
                    )
            );
            return (String) result.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Impossible d'uploader le fichier: " + e.getMessage(), e);
        }
    }

    private String extractPublicId(String url) {
        // https://res.cloudinary.com/cloud/image/upload/v123/artpourchrist/photos/file.jpg
        // → artpourchrist/photos/file
        String[] parts = url.split("/upload/");
        if (parts.length < 2) return url;
        String path = parts[1];
        path = path.replaceFirst("^v\\d+/", "");
        int dotIndex = path.lastIndexOf('.');
        if (dotIndex != -1) path = path.substring(0, dotIndex);
        return path;
    }

    private void validateContentType(MultipartFile file, Set<String> allowedTypes) {
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new RuntimeException(
                    "Type de fichier non autorisé: " + contentType +
                    ". Types acceptés: " + allowedTypes
            );
        }
    }
}
