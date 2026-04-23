package com.artpourchrist.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Protection contre les attaques brute-force sur le login.
 * Bloque une IP après MAX_ATTEMPTS échecs sur une fenêtre de BLOCK_DURATION_MS.
 *
 * Note : stockage en mémoire — suffisant pour un déploiement single-instance.
 * Pour du multi-instance, remplacer par un cache distribué (Redis, Hazelcast).
 */
@Service
public class LoginAttemptService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long BLOCK_DURATION_MS = 15 * 60 * 1000L; // 15 minutes

    private static class AttemptInfo {
        final AtomicInteger count;
        volatile long lastAttemptTime;

        AttemptInfo() {
            this.count = new AtomicInteger(1);
            this.lastAttemptTime = System.currentTimeMillis();
        }
    }

    private final ConcurrentHashMap<String, AttemptInfo> cache = new ConcurrentHashMap<>();

    public boolean isBlocked(String key) {
        AttemptInfo info = cache.get(key);
        if (info == null) return false;

        long elapsed = System.currentTimeMillis() - info.lastAttemptTime;
        if (elapsed > BLOCK_DURATION_MS) {
            cache.remove(key);
            return false;
        }
        return info.count.get() >= MAX_ATTEMPTS;
    }

    public void registerFailure(String key) {
        cache.compute(key, (k, existing) -> {
            if (existing == null) return new AttemptInfo();
            existing.count.incrementAndGet();
            existing.lastAttemptTime = System.currentTimeMillis();
            return existing;
        });
    }

    public void registerSuccess(String key) {
        cache.remove(key);
    }
}
