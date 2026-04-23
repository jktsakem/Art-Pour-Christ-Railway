package com.artpourchrist.service;

import com.artpourchrist.model.Activity;
import com.artpourchrist.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    public void log(String title, Activity.ActivityType type, Activity.ActivityAction action) {
        Activity activity = Activity.builder()
                .title(title)
                .type(type)
                .action(action)
                .build();
        activityRepository.save(activity);
    }

    public List<Activity> getRecent(int limit) {
        return activityRepository.findAllByOrderByDateDesc(PageRequest.of(0, limit));
    }
}
