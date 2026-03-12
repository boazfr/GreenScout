package com.greenscout.api.controller;

import com.greenscout.api.dto.ActivityLocationDto;
import com.greenscout.api.service.LocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class ActivityLocationController {

    private final LocationService locationService;

    public ActivityLocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/nearby")
    public List<ActivityLocationDto> nearby(
            @RequestParam double lat,
            @RequestParam double lon,
            @RequestParam(defaultValue = "5000") double radius,
            @RequestParam(required = false) String category) {
        return locationService.getNearby(lat, lon, radius, category)
                .stream()
                .map(ActivityLocationDto::from)
                .toList();
    }
}
