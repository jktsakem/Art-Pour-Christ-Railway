package com.artpourchrist.repository;

import com.artpourchrist.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<ContactMessage, String> {
}
