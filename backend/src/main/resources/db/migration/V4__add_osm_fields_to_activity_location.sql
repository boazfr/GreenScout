ALTER TABLE activity_location
    ADD COLUMN osm_id BIGINT UNIQUE,
    ADD COLUMN fetched_at TIMESTAMPTZ;
