CREATE TABLE IF NOT EXISTS stations (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    internalEDRid VARCHAR,
    simrailNewEDRid INTEGER,
    cacheDate TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS stations_timetable_rows (

)