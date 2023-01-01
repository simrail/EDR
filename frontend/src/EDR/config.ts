import TER from "../images/TER.png";
import EP07 from "../images/EP07.png";
import EN76 from "../images/EN76.png";
// import Vector from "../images/Vector.png";
import TRAXX from "../images/TRAXX.png";

export const configByType: {[k: string]: any} = {
    "ROJ": {
        icon: TER,
        color: "success"
    },
    "MPE": {
        icon: EP07,
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

export const AllowedServers = ["fr1", "fr2"];

/*
https://panel.simrail.eu:8091/?station=Katowice_Zawodzie&serverCode=pl1
https://panel.simrail.eu:8091/?station=Sosnowiec_Główny&station=Sosnowiec_Gł._pzs_R52&serverCode=pl1
https://panel.simrail.eu:8091/?station=Będzin&serverCode=pl1
https://panel.simrail.eu:8091/?station=Dąbrowa Górnicza&serverCode=pl1
https://panel.simrail.eu:8091/?station=Łazy Łc&serverCode=pl1
https://panel.simrail.eu:8091/?station=Góra Włodowska&serverCode=pl1
https://panel.simrail.eu:8091/?station=Psary&serverCode=pl1
https://panel.simrail.eu:8091/?station=Knapówka&serverCode=pl1
https://panel.simrail.eu:8091/?station=Włoszczowa Północ&serverCode=pl1
https://panel.simrail.eu:8091/?station=Olszamowice&serverCode=pl1
https://panel.simrail.eu:8091/?station=Pilichowice&serverCode=pl1
 */
export const PostNameToIdentifier = {
    [encodeURIComponent("Góra Włodowska")]: "Góra Włodowska",
    [encodeURIComponent("Psary")]: "Psary",
    [encodeURIComponent("Knapówka")]: "Knapówka",
    [encodeURIComponent("Włoszczowa Północ")]: "Włoszczowa Północ",
    [encodeURIComponent("Olszamowice")]: "Olszamowice",
    [encodeURIComponent("Pilichowice")]: "Pilichowice",
    [encodeURIComponent("Katowice Zawodzie")]: "Katowice_Zawodzie",
    [encodeURIComponent("Sosnowiec Główny")]: "Sosnowiec_Główny",
    [encodeURIComponent("Dąbrowa Górnicza")]: "Dąbrowa Górnicza",
    [encodeURIComponent("Będzin")]: "Będzin",
    [encodeURIComponent("Łazy Łc")]: "Łazy Łc"
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
    "ynhx6",
    "JfLGj",
    "V6ECb",
    "bgO5Q",
    "46Ijv",
    "zLiYV",
    "Q6waB",
    "qATVA",
    "xzRkm",
    "2GN0n",
    "O3GX3"
]