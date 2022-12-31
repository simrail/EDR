module.exports = {
    BASE_SIMRAIL_DISPATCH_API: "https://panel.simrail.eu:8091/",
    BASE_SIMRAIL_API: "https://panel.simrail.eu:8084/",
    srHeaders:{
        "User-Agent": "Custom EDR vDEV",
        "xx-client": "Custom EDR",
        "xx-maintainer": "DeadlyKungFu.Ninja",
        "xx-contact": "DeadlyKungFu.Ninja#8294",
        "xx-message": "Please dont ban this IP this is me developing stuff (not production server)"
    },
    SERVERS: ['fr1', 'fr2'],
    POSTS: ['Katowice_Zawodzie', 'Sosnowiec_Główny'],
    vmax_by_type: {
        EIJ: 200,
        ECE: 125,
        MPE: 125,
        RPJ: 120,
        ROJ: 120,
        LTE: 125,
        TME: 80,
        TLE: 80,
        TCE: 85
    },
    translate_fields: {
        "K": "k",
        "NK": "nk",
        "Scheduled arrival": "scheduled_arrival",
        "+/-": "offset",
        "Real arrival": "real_arrival",
        "Type": "type",
        "Train no.": "train_number",
        "From post": "from",
        "To post": "to",
        "Track": "track",
        "Line no.": "line",
        "Layover": "layover",
        "Stop type": "stop_type",
        "P T": "platform",
        "Scheduled departure": "scheduled_departure",
        "Real departure": "real_departure",
        "Start station": "start_station",
        "Terminus station": "terminus_station",
        "Carrier": "carrier"
    }
}