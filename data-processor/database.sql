-- PostgreSQL v14
CREATE TABLE IF NOT EXISTS stations_timetable_row (
    simrail_new_edr_station_id VARCHAR NOT NULL,
    train_number VARCHAR NOT NULL,

    train_type VARCHAR NOT NULL,
    type_speed INTEGER,

    stop_type VARCHAR,
    platform VARCHAR,

    arrival_time VARCHAR NOT NULL,
    departure_time VARCHAR NOT NULL,
    arrival_date VARCHAR NOT NULL,
    departure_date VARCHAR NOT NULL,

    from_post VARCHAR NOT NULL,
    to_post VARCHAR NOT NULL,
    line VARCHAR NOT NULL,
    start_station VARCHAR NOT NULL,
    terminus_station VARCHAR NOT NULL,
    cacheDate TIMESTAMP NOT NULL
);

ALTER TABLE stations_timetable_row ADD CONSTRAINT stations_timetable_row_pk PRIMARY KEY (train_number, simrail_new_edr_station_id);
CREATE INDEX stations_timetable_row_simrail_new_edr_station_id ON stations_timetable_row (simrail_new_edr_station_id);
CREATE INDEX stations_timetable_row_simrail_new_departure_date ON stations_timetable_row (simrail_new_edr_station_id);

CREATE TABLE IF NOT EXISTS trains_timetable_row (
    train_number VARCHAR,
    scheduled_arrival VARCHAR,
    scheduled_arrival_hour VARCHAR,
    real_arrival VARCHAR,
    real_arrival_hour VARCHAR,

    station VARCHAR NOT NULL,
    stop_type VARCHAR,
    layover VARCHAR,

    scheduled_departure_hour VARCHAR,
    real_departure VARCHAR,
    real_departure_hour VARCHAR,

    train_type VARCHAR NOT NULL,
    line VARCHAR NOT NULL,
    cacheDate TIMESTAMP NOT NULL
);

ALTER TABLE trains_timetable_row ADD CONSTRAINT trains_timetable_row_pk PRIMARY KEY (train_number, station);