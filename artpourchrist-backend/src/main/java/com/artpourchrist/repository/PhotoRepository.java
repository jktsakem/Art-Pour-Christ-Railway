package com.artpourchrist.repository;

import com.artpourchrist.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, String> {
    List<Photo> findAllByOrderByCreatedAtDesc();
    List<Photo> findByCategoryOrderByCreatedAtDesc(String category);
}
