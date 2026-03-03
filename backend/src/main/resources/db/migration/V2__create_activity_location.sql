CREATE TABLE activity_location (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    category    VARCHAR(100) NOT NULL,
    location    geometry(Point, 4326) NOT NULL
);

CREATE INDEX idx_activity_location_gist ON activity_location USING GIST (location);
