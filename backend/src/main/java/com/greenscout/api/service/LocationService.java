package com.greenscout.api.service;

import com.greenscout.api.model.ActivityLocation;
import com.greenscout.api.repository.ActivityLocationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LocationService {

    private final ActivityLocationRepository repository;
    private final OverpassService overpassService;

    @Value("${greenscout.overpass.cache-ttl-hours}")
    private int cacheTtlHours;

    public LocationService(ActivityLocationRepository repository, OverpassService overpassService) {
        this.repository = repository;
        this.overpassService = overpassService;
    }

    public List<ActivityLocation> getNearby(double lat, double lon, double radiusMeters) {
        Instant cutoff = Instant.now().minus(cacheTtlHours, ChronoUnit.HOURS);
        long recentCount = repository.countRecentlyFetchedNearby(lat, lon, radiusMeters, cutoff);

        if (recentCount == 0) {
            overpassService.fetchAndCacheNearby(lat, lon, radiusMeters);
        }

        return repository.findNearby(lat, lon, radiusMeters);
    }
}
