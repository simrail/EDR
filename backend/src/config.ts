export const BASE_SIMRAIL_DISPATCH_API = "https://panel.simrail.eu:8091/";
export const BASE_SIMRAIL_API = "https://panel.simrail.eu:8084/";
export const BASE_AWS_API = "https://api1.aws.simrail.eu:8082/api/"

export const srHeaders = {
    "User-Agent": "Custom EDR vDEV",
    "xx-client": "Custom EDR",
    "xx-maintainer": "DeadlyKungFu.Ninja",
    "xx-contact": "DeadlyKungFu.Ninja#8294",
    "xx-executor": "outbound.gcp.infra.deadlykungfu.ninja",
    "xx-message": "Beta access only for you, that monitor this network : https://edr.deadlykungfu.ninja/?betaToken=unjN6"
    // "xx-message": "Please dont ban this IP this is me developing stuff (not production server)"
};

export const internalIdToSrId: {[k: string]: string} = {
    "GW": "Góra Włodowska",
    "PS": "Psary",
    "KN": "Knapówka",
    "WP" : "Włoszczowa Północ",
    "OZ": "Olszamowice",
    "PI": "Pilichowice",
    "KZ": "Katowice_Zawodzie",
    "SG": "Sosnowiec_Główny",
    "DG": "Dąbrowa Górnicza",
    "T1_BZ": "Będzin",
    "LZ_LC": "Łazy Łc",
    "ZA": "Zawiercie",
    "OP_PO": "Opoczno Południe",
    "DG_WZ": "Dąbrowa Górnicza Wschodnia",
    "DG_ZA": "",
    "SG_PO": "Sosnowiec Południowy"
}

export const POSTS: { [key: string]: PURE_POST[] } = {
    "Góra Włodowska": ["Góra Włodowska"],
    "Psary": ["Psary"],
    "Knapówka": ["Knapówka"],
    "Włoszczowa Północ": ["Włoszczowa Północ"],
    "Olszamowice": ["Olszamowice"],
    "Pilichowice": ["Pilichowice"],
    "Katowice_Zawodzie": ["Katowice_Zawodzie"],
    "Sosnowiec_Główny": ["Sosnowiec_Główny", "Sosnowiec_Gł._pzs_R52"],
    "Dąbrowa Górnicza": ["Dąbrowa Górnicza"],
    "Będzin": ["Będzin"],
    "Łazy Łc": ["Łazy Łc"],
    "Zawiercie": ["Zawiercie"],
    "Opoczno Południe": ["Opoczno Południe"],
    "Dąbrowa Górnicza Wschodnia": ["Dąbrowa Górnicza Wschodnia"],
    "Dąbrowa Górnicza Ząbkowice": ["Dąbrowa Górnicza Ząbkowice"],
    "Sosnowiec Południowy": ["Sosnowiec Południowy"]

};

export type PURE_POST = 
    "Góra Włodowska" |
    "Psary" |
    "Knapówka" |
    "Włoszczowa Północ" |
    "Olszamowice" |
    "Pilichowice" |
    "Katowice_Zawodzie" |
    "Sosnowiec_Główny" |
    "Sosnowiec_Gł._pzs_R52" |
    "Dąbrowa Górnicza" |
    "Będzin" |
    "Łazy Łc" |
    "Zawiercie" |
    "Opoczno Południe" |
    "Dąbrowa Górnicza Wschodnia" |
    "Dąbrowa Górnicza Ząbkowice" |
    "Sosnowiec Południowy"

export enum VMAX_BY_TYPE {
    EIJ = 200,
    ECE = 125,
    MPE = 125,
    RPJ = 120,
    ROJ = 120,
    LTE = 125,
    TME = 80,
    TLE = 80,
    TCE = 85
};

export const translate_fields = {
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
