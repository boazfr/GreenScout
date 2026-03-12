package com.greenscout.api.dto;

import com.greenscout.api.model.ActivityLocation;

public record ActivityLocationDto(
        Long id,
        String name,
        String description,
        String category,
        Long osmId,
        GeoJsonPoint location
) {
    public record GeoJsonPoint(String type, double[] coordinates) {}

    public static ActivityLocationDto from(ActivityLocation entity) {
        double lon = entity.getLocation().getX();
        double lat = entity.getLocation().getY();
        return new ActivityLocationDto(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getCategory(),
                entity.getOsmId(),
                new GeoJsonPoint("Point", new double[]{lon, lat})
        );
    }
}
