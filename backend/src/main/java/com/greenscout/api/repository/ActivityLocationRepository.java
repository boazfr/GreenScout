package com.greenscout.api.repository;

import com.greenscout.api.model.ActivityLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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
}
