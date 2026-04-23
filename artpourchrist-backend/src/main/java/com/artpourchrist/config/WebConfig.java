package com.artpourchrist.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // Les fichiers sont stockés sur Cloudinary — aucun dossier local à exposer.
}
