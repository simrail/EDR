import TER from "../images/TER.png";
import EP07 from "../images/EP07.png";
import EN76 from "../images/EN76.png";
import TERREGIO from "../images/TER_REGIO.png";
// import Vector from "../images/Vector.png";
import TRAXX from "../images/TRAXX.png";

export const configByType: {[k: string]: any} = {
    "ROJ": {
        icon: TER,
        color: "success"
    },
    "MPE": {
        icon: TERREGIO,
        color: "success"
    },
    "MOJ": {
        icon: EP07,
        color: "success"
    },
    "ECE": {
        icon: EP07,
        color: "success"
    },
    "EIJ": {
        icon: EN76,
        color: "success"
    },
    "RPJ": {
        icon: TER,
        color: "success"
    },
    "LTE": {
        icon: TRAXX,
        color: "gray"
    },
    "TME": {
        icon: EP07,
        color: "warning"
    },
    "TCE": {
        icon: EP07,
        color: "warning"
    },
}

export const AllowedServers = ['fr1', 'fr2', 'cz1', 'pl1', 'pl2', 'es1', 'es2', 'de2'];

// Polish characters are not allowed as map keys
export const internalConfigPostIds = {
    "GW": encodeURIComponent("Góra Włodowska"),
    "PS": encodeURIComponent("Psary"),
    "KN": encodeURIComponent("Knapówka"),
    "WP": encodeURIComponent("Włoszczowa Północ"),
    "OZ": encodeURIComponent("Olszamowice"),
    "PI": encodeURIComponent("Pilichowice"),
    "KZ": encodeURIComponent("Katowice Zawodzie"),
    "SG": encodeURIComponent("Sosnowiec Główny"),
    "DG": encodeURIComponent("Dąbrowa Górnicza"),
    "T1_BZ": encodeURIComponent("Będzin"),
    "LZ_LC": encodeURIComponent("Łazy Łc")
};

export const postToInternalIds = {
    [encodeURIComponent("Góra Włodowska")]: "GW",
    [encodeURIComponent("Psary")]: "PS",
    [encodeURIComponent("Knapówka")]: "KN",
    [encodeURIComponent("Włoszczowa Północ")]: "WP",
    [encodeURIComponent("Olszamowice")]: "OZ",
    [encodeURIComponent("Pilichowice")]: "PI",
    [encodeURIComponent("Katowice Zawodzie")]: "KZ",
    [encodeURIComponent("Sosnowiec Główny")]: "SG",
    [encodeURIComponent("Dąbrowa Górnicza")]: "DG",
    [encodeURIComponent("Będzin")]: "T1_BZ",
    [encodeURIComponent("Łazy Łc")]: "LZ_LC"
}

export const postConfig: {[k: string]: any} = {
    GB: {
        srId: "Góra Włodowska",
        trainPosRange: 0.5,
        platformPosOverride: [19.470318, 50.584134]
    },
    PS: {
        srId: "Psary",
        trainPosRange: 0.5
    },
    KN: {
        srId: "Knapówka",
        trainPosRange: 0.5
    },
    WP: {
        srId: "Włoszczowa Północ",
        trainPosRange: 0.5,
        platformPosOverride: [19.945774, 50.856198]
    },
    OZ: {
        srId: "Olszamowice",
        trainPosRange: 0.5
    },
    PI: {
        srId: "Pilichowice",
        trainPosRange: 0.5
    },
    KZ: {
        srId: "Katowice_Zawodzie",
        trainPosRange: 0.5,
        platformPosOverride: [19.057551, 50.257280]
    },
    SG: {
        srId: "Sosnowiec_Główny",
        trainPosRange: 1,
        platformPosOverride: [19.1270833, 50.2793889]
    },
    DG: {
        srId: "Dąbrowa Górnicza",
        trainPosRange: 0.5,
        platformPosOverride: [19.184696, 50.330386]
    },
    T1_BZ: {
        srId: "Będzin",
        trainPosRange: 0.5
    },
    LZ_LC: {
        srId:"Łazy Łc",
        trainPosRange: 0.5
    }
    // Zawi override platform pos for later: Zawiercie 50.480875, 19.423094 150M
}

export const betaTokens = [
    "SzdW1", // DKFN
    "MDCI9", // IWhite
    "oT8V2", // The Mulhoose
    "unjN6", // Simrail Dev
    "FTvXV", // AlexisG
    "Cwoyl", // Sumonil
    "MA3V2", // Vassil
    "JdoeA", // NemoInside
    "NeFjS", // Major.KS90
    // "tjcfK", // Bioxyde
    "N78kc", // Mr Poisson
    "z7V45", // Lactic
    "6aXDY", // Steeproll
    "ynhx6", // Howky
    "JfLGj", // Alexis96x2
    "V6ECb", // CZ Friend 1
    "bgO5Q", // CZ Friend 2
    "46Ijv", // Aurel
    "zLiYV", // Jason_
    "Q6waB", // AlexKall
    "qATVA",
    "xzRkm",
    "2GN0n",
    "O3GX3"
];

export const PlatformsConfig = {

}