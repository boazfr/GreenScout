package com.greenscout.api.controller;

import com.greenscout.api.model.ActivityLocation;
import com.greenscout.api.repository.ActivityLocationRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class ActivityLocationController {

    private final ActivityLocationRepository locationRepository;

    public ActivityLocationController(ActivityLocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @GetMapping("/nearby")
    public List<ActivityLocation> nearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5000") double radius) {
        return locationRepository.findNearby(lat, lon, radius);
    }
}
