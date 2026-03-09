package com.greenscout.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenscout.api.model.ActivityLocation;
import com.greenscout.api.repository.ActivityLocationRepository;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.util.Map;

@Service
public class OverpassService {

    private static final Logger log = LoggerFactory.getLogger(OverpassService.class);

    private static final Map<String, String> TAG_TO_CATEGORY = Map.of(
            "playground", "playground",
            "garden", "garden",
            "park", "park",
            "nature_reserve", "nature",
            "viewpoint", "viewpoint",
            "picnic_site", "picnic"
    );

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final ActivityLocationRepository repository;
    private final GeometryFactory geometryFactory;

    @Value("${greenscout.overpass.url}")
    private String overpassUrl;

    public OverpassService(ActivityLocationRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.create();
        this.geometryFactory = new GeometryFactory(new PrecisionModel(), 4326);
    }

    public void fetchAndCacheNearby(double lat, double lon, double radiusMeters) {
        String query = buildQuery(lat, lon, radiusMeters);
        try {
            String body = restClient.post()
                    .uri(overpassUrl)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .body("data=" + java.net.URLEncoder.encode(query, java.nio.charset.StandardCharsets.UTF_8))
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(body);
            JsonNode elements = root.path("elements");
            if (!elements.isArray()) {
                log.warn("Overpass response has no elements array");
                return;
            }

            for (JsonNode element : elements) {
                processElement(element);
            }
            log.info("Overpass fetch complete for ({}, {}), radius {}m — {} elements processed",
                    lat, lon, radiusMeters, elements.size());

        } catch (Exception e) {
            log.error("Overpass API call failed for ({}, {}): {}", lat, lon, e.getMessage(), e);
        }
    }

    private String buildQuery(double lat, double lon, double radiusMeters) {
        int radius = (int) radiusMeters;
        return String.format("""
                [out:json][timeout:25];
                (
                  nwr["leisure"="playground"](around:%d,%f,%f);
                  nwr["leisure"="garden"](around:%d,%f,%f);
                  nwr["leisure"="park"](around:%d,%f,%f);
                  nwr["leisure"="nature_reserve"](around:%d,%f,%f);
                  nwr["tourism"="viewpoint"](around:%d,%f,%f);
                  nwr["tourism"="picnic_site"](around:%d,%f,%f);
                );
                out center tags;
                """,
                radius, lat, lon,
                radius, lat, lon,
                radius, lat, lon,
                radius, lat, lon,
                radius, lat, lon,
                radius, lat, lon);
    }

    private void processElement(JsonNode element) {
        try {
            JsonNode tags = element.path("tags");
            if (!tags.has("name")) {
                return;
            }

            long osmId = element.path("id").asLong();
            String name = tags.path("name").asText();
            String category = resolveCategory(tags);
            if (category == null) {
                return;
            }

            double elLat = resolveCoordinate(element, "lat");
            double elLon = resolveCoordinate(element, "lon");
            if (Double.isNaN(elLat) || Double.isNaN(elLon)) {
                return;
            }

            ActivityLocation loc = repository.findByOsmId(osmId).orElseGet(ActivityLocation::new);
            loc.setOsmId(osmId);
            loc.setName(name);
            loc.setDescription(tags.has("description") ? tags.path("description").asText() : null);
            loc.setCategory(category);
            loc.setLocation(geometryFactory.createPoint(new Coordinate(elLon, elLat)));
            loc.setFetchedAt(Instant.now());
            repository.save(loc);

        } catch (Exception e) {
            log.warn("Failed to process Overpass element: {}", e.getMessage());
        }
    }

    private double resolveCoordinate(JsonNode element, String field) {
        if (element.has(field)) {
            return element.path(field).asDouble();
        }
        JsonNode center = element.path("center");
        if (center.has(field)) {
            return center.path(field).asDouble();
        }
        return Double.NaN;
    }

    private String resolveCategory(JsonNode tags) {
        String leisure = tags.path("leisure").asText(null);
        if (leisure != null && TAG_TO_CATEGORY.containsKey(leisure)) {
            return TAG_TO_CATEGORY.get(leisure);
        }
        String tourism = tags.path("tourism").asText(null);
        if (tourism != null && TAG_TO_CATEGORY.containsKey(tourism)) {
            return TAG_TO_CATEGORY.get(tourism);
        }
        return null;
    }
}
