CREATE TABLE app_user (
    id          BIGSERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL UNIQUE,
    name        VARCHAR(255),
    picture_url VARCHAR(512),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
