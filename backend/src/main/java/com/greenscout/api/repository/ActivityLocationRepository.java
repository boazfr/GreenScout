package com.greenscout.api.repository;

import com.greenscout.api.model.ActivityLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface ActivityLocationRepository extends JpaRepository<ActivityLocation, Long> {

    @Query(value = """
        SELECT * FROM activity_location
        WHERE ST_DWithin(
            location::geography,
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
            :radiusMeters
        )
        ORDER BY location::geography <-> ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
        """, nativeQuery = true)
    List<ActivityLocation> findNearby(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusMeters") double radiusMeters);

    @Query(value = """
        SELECT * FROM activity_location
        WHERE category = :category
        AND ST_DWithin(
            location::geography,
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
            :radiusMeters
        )
        ORDER BY location::geography <-> ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
        """, nativeQuery = true)
    List<ActivityLocation> findNearbyByCategory(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusMeters") double radiusMeters,
            @Param("category") String category);

    Optional<ActivityLocation> findByOsmId(Long osmId);

    @Query(value = """
        SELECT COUNT(*) FROM activity_location
        WHERE fetched_at > :cutoff
        AND ST_DWithin(
            location::geography,
            ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
            :radiusMeters
        )
        """, nativeQuery = true)
    long countRecentlyFetchedNearby(
            @Param("lat") double lat,
            @Param("lon") double lon,
            @Param("radiusMeters") double radiusMeters,
            @Param("cutoff") Instant cutoff);
}
