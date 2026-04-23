package com.artpourchrist.repository;

import com.artpourchrist.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VideoRepository extends JpaRepository<Video, String> {
    List<Video> findAllByOrderByCreatedAtDesc();
    List<Video> findByCategoryOrderByCreatedAtDesc(String category);
}
