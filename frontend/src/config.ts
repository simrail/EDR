import EN96 from "./images/EN96.png";
import EU07_CARGO from "./images/EU07_CARGO.png";
import EU07_IC from "./images/EU07_IC.png";
import EN76 from "./images/EN76.png";
import ET25 from "./images/ET25.png";
import TRAXX from "./images/TRAXX.png";
import PENDOLINO from './images/Pendolino.png';

import GW from "./images/posts/gw.jpg";
import PS from "./images/posts/ps.jpg";
import KN from "./images/posts/kn.jpg";
import WP from "./images/posts/wp.jpg";
import OL from "./images/posts/ol.jpg";
import PI from "./images/posts/pi.jpg";
import KZ from "./images/posts/kz.jpg";
import SG from "./images/posts/sg.jpg";
import DG from "./images/posts/dg.jpg";
import BN from "./images/posts/bn.jpg";
import LC from "./images/posts/lc.jpg";
import ZA from "./images/posts/zw.png";
import OP_PO from "./images/posts/op_po.png";

import { GB, FR, PL, CZ, ES, DE, UA, IT, CN, PT} from 'country-flag-icons/string/3x2'

import _keyBy from "lodash/keyBy";

export const LOGGING = false;

export const countriesFlags: {[k: string]: any} = {
    EN: GB,
    FR,
    PL,
    CZ,
    ES,
    DE,
    UA,
    IT,
    CN,
    PT
}

export const configByLoco: {[k: string]: any} = {
    "Pendolino/ED250-018 Variant": {
        icon: PENDOLINO,
    },
    "4E/EP07-135": {
        icon: EU07_IC,
    },
    "Traxx/Traxx": {
        icon: TRAXX,
    },
    "Traxx/E186-134": {
        icon: TRAXX,
    },
    "Elf/EN76-022": {
        icon: EN76,
    },
    "Elf/EN76-006": {
        icon: EN76,
    },
    "Elf/EN96-001": {
        icon: EN96,
    },
    "4E/EU07-096": {
        icon: EU07_CARGO,
    },
    "4E/4E": {
        icon: EU07_CARGO,
    },
    "Dragon2/ET25-002": {
        icon: ET25,
    }
}
// Service types: https://en.plk-sa.pl/files/public/user_upload/pdf/Reg_przydzielania_tras/Regulamin_sieci_2021_2022/25.02.2022/zal_6.3_Reg21_22_v22_ANG_KOLOR.PDF
export const configByType: {[k: string]: any} = {
    "ROJ": {
        color: "success",
        icon: EN96
    },
    "MPE": {
        icon: EU07_IC,
        color: "success"
    },
    "MOJ": {
        color: "success",
        icon: EN96
    },
    "ECE": {
        icon: EU07_IC,
        color: "success"
    },
    "EIJ": {
        color: "success",
        icon: EN76,
    },
    "RPJ": {
        color: "success",
        icon: EN76
    },
    "LTE": {
        color: "gray",
        icon: TRAXX
    },
    "TME": {
        color: "warning",
        icon: EU07_CARGO
    },
    "TCE": {
        color: "warning",
        icon: EU07_CARGO
    },
}

// Polish characters are not allowed as map keys
export const internalConfigPostIds: {[k: string]: string} = {
    "GW": encodeURIComponent("Góra Włodowska"),
    "PS": encodeURIComponent("Psary"),
    "KN": encodeURIComponent("Knapówka"),
    "WP": encodeURIComponent("Włoszczowa Północ"),
    "OZ": encodeURIComponent("Olszamowice"),
    "PI": encodeURIComponent("Pilichowice"),
    "KZ": encodeURIComponent("Katowice_Zawodzie"),
    "SG": encodeURIComponent("Sosnowiec Główny"),
    "DG": encodeURIComponent("Dąbrowa Górnicza"),
    "T1_BZ": encodeURIComponent("Będzin"),
    "LZ_LC": encodeURIComponent("Łazy Łc")
};


type StationConfig = {
    id: string,
    srId: string;
    trainPosRange: number;
    platformPosOverride?: [number, number];
}

export const postConfig: {[k: string]: StationConfig} = {
    GW: {
        id: "GW",
        srId: "Góra Włodowska",
        trainPosRange: 0.5,
        platformPosOverride: [19.470318, 50.584134]
    },
    PS: {
        id: "PS",
        srId: "Psary",
        trainPosRange: 0.5,
        platformPosOverride: [19.820087, 50.735068]
    },
    KN: {
        id: "KN",
        srId: "Knapówka", // TODO: Missing data
        trainPosRange: 0.5,
        platformPosOverride: [19.9049155, 50.8001411]
    },
    WP: {
        id: "WP",
        srId: "Włoszczowa Północ",
        trainPosRange: 0.5,
        platformPosOverride: [19.945774, 50.856198]
    },
    OZ: {
        id: "OZ",
        srId: "Olszamowice", // TODO: Missing data
        trainPosRange: 0.5,
        platformPosOverride: [20.0645106, 51.0955558]
    },
    PI: {
        id: "PI",
        srId: "Pilichowice", // TODO: Missing data
        trainPosRange: 0.5,
        platformPosOverride: [20.1210684, 51.2546948]
    },
    KZ: {
        id: "KZ",
        srId: "Katowice Zawodzie",
        trainPosRange: 0.5,
        platformPosOverride: [19.057551, 50.257280]
    },
    SG: {
        id: "SG",
        srId: "Sosnowiec Główny",
        trainPosRange: 1,
        platformPosOverride: [19.1270833, 50.2793889]
    },
    SG_R52: {
        id: "SG_R52",
        srId: "Sosnowiec Gł. pzs R52",
        trainPosRange: 1,
        platformPosOverride: [19.114761, 50.272224]
    },
    SG_PO: {
        id: "SG_PO",
        srId: "Sosnowiec Południowy",
        trainPosRange: 0.5,
        platformPosOverride: [19.1255985, 50.2695509]
    },
    SG_DK: {
        id: "SG_DK",
        srId: "Sosnowiec Dańdówka",
        trainPosRange: 0.5,
        platformPosOverride: [19.1771544, 50.2668305]
    },
    SG_POR: {
        id: "SG_POR",
        srId: "Sosnowiec Porąbka",
        trainPosRange: 0.5,
        platformPosOverride: [19.226053369508186, 50.27701912347849]

    },
    SG_KAZ: {
        id: "SG_KAZ",
        srId: "Sosnowiec Kazimierz",
        trainPosRange: 0.5,
        platformPosOverride: [19.226053369508186, 50.27701912347849]
    },
    T1_BZ: {
        id: "T1_BZ",
        srId: "Będzin", // TODO: Missing data
        trainPosRange: 0.5,
        platformPosOverride: [19.1418582, 50.3085335]
    },
    LZ_LC: {
        id: "LZ_LC",
        srId:"Łazy Łc",
        platformPosOverride: [19.362862, 50.416436],
        trainPosRange: 0.5
    },
    LZ: {
        id: "LZ",
        srId:"Łazy",
        trainPosRange: 0.5,
        platformPosOverride: [19.3866133, 50.4284008]
    },
    LZ_LB: {
        id: "LZ_LB",
        srId: "Łazy ŁB",
        trainPosRange: 0.5,
        platformPosOverride: [19.3841013, 50.4311907]
    },
    LZ_LA : {
        id: "LZ_LA",
        srId: "Łazy Ła",
        trainPosRange: 0.5,
        platformPosOverride: [19.4202556, 50.4538922]
    },
    OP_PO: {
        id: "OP_PO",
        srId:"Opoczno Południe",
        trainPosRange: 0.5,
        platformPosOverride: [20.232192, 51.358965]
    },
    MY: {
        id: "MY",
        srId:"Myszków",
        trainPosRange: 0.5,
        platformPosOverride: [19.3272652, 50.5646969]
    },
    MY_MR: {
        id: "MY_MR",
        srId:"Myszków Mrzygłód",
        trainPosRange: 0.5,
        platformPosOverride: [19.377319, 50.543482]
    },
    ZA_BO_PO: {
        id: "ZA_BO_PO",
        srId:"Zawiercie Borowe Pole",
        trainPosRange: 0.5,
        platformPosOverride: [19.398674, 50.511076]
    },
    ZA: {
        id: "ZA",
        srId:"Zawiercie",
        trainPosRange: 0.5,
        platformPosOverride: [19.423131, 50.481001]
    },
    WI: {
        id: "WI",
        srId:"Wiesiółka",
        trainPosRange: 0.5,
        platformPosOverride: [19.349172, 50.414688]
    },
    CZ: {
        id: "CZ",
        srId:"Chruszczobród",
        trainPosRange: 0.5,
        platformPosOverride: [19.329007, 50.400345]
    },
    DG: {
        id: "DG",
        srId: "Dąbrowa Górnicza",
        trainPosRange: 0.5,
        platformPosOverride: [19.184696, 50.330386]
    },
    DG_SI: {
        id: "DG_SI",
        srId:"Dąbrowa Górnicza Sikorka",
        trainPosRange: 0.5,
        platformPosOverride: [19.299095, 50.388950]
    },
    DG_ZA: {
        id: "DG_ZA",
        srId:"Dąbrowa Górnicza Ząbkowice",
        trainPosRange: 0.5,
        platformPosOverride: [19.264612, 50.366385]
    },
    DG_DZA: {
        id: "DG_DZA",
        srId: "Dąbrowa Górnicza Ząbkowice DZA",
        trainPosRange: 0.5,
        platformPosOverride: [19.2725769, 50.375841]
    },
    DG_DZA_R47: {
        id: "DG_DZA_R47",
        srId: "Dąbrowa Górn. Ząbkowice DZA R.4/7",
        trainPosRange: 0.5,
        platformPosOverride: [19.2725769, 50.375841]
    },
    DG_PO: {
        id: "DG_PO",
        srId:"Dąbrowa Górnicza Pogoria",
        trainPosRange: 0.5,
        platformPosOverride: [19.240848, 50.350499]
    },
    DG_GO: {
        id: "DG_GO",
        srId:"Dąbrowa Górnicza Gołonóg",
        trainPosRange: 0.5,
        platformPosOverride: [19.225709, 50.343768]
    },
    DG_WZ: {
        id: "DG_WZ",
        srId: "Dąbrowa Górnicza Wschodnia",
        trainPosRange: 0.5,
        platformPosOverride: [19.31384974905758, 50.306421359840016]
    },
    BZ_KS: {
        id: "BZ_KS",
        srId:"Będzin Ksawera",
        trainPosRange: 0.5,
        platformPosOverride: [19.157925, 50.330515]
    },
    BZ_MI: {
        id: "BZ_MI",
        srId:"Będzin Miasto",
        trainPosRange: 0.5,
        platformPosOverride: [19.135523, 50.319178]
    },
    KSP: {
        id: "KSP",
        srId:"Katowice Szopienice Południowe",
        trainPosRange: 0.5,
        platformPosOverride: [19.092237, 50.258875]
    },
    KO: {
        id: "KO",
        srId:"Katowice",
        trainPosRange: 0.5,
        platformPosOverride: [19.017109, 50.257589]
    },
    CZ_R19: {
        id: "CZ_R19",
        srId: "Czarnca R19",
        trainPosRange: 0.5,
        platformPosOverride: [19.9447178, 50.823259]
    },
    STZ: {
        id: "STZ",
        srId: "Starzyny",
        trainPosRange: 0.5,
        platformPosOverride: [19.813349, 50.6941496]
    },
    IDZ: {
        id: "IDZ",
        srId: "Idzikowice",
        trainPosRange: 0.5,
        platformPosOverride: [20.3161252, 51.4497225]
    },
    STR: {
        id: "STR",
        srId: "Strzałki",
        trainPosRange: 0.5,
        platformPosOverride: [20.4066873, 51.6428704]
    },
    SZE: {
        id: "SZE",
        srId: "Szeligi",
        trainPosRange: 0.5,
        platformPosOverride: [20.4571999, 51.942969]
    },
    JKT: {
        id: "JKT",
        srId: "Jaktorów",
        trainPosRange: 0.5,
        platformPosOverride: [20.5520155, 52.0868088]
    },
    GRO_MAZ: {
        id: "GRO_MAZ",
        srId: "Grodzisk Mazowiecki",
        trainPosRange: 0.5,
        platformPosOverride: [20.6231492, 52.1101932]
    },
    MIL: {
        id: "MIL",
        srId: "Milanówek",
        trainPosRange: 0.5,
        platformPosOverride: [20.6670406, 52.1248885]
    },
    BRW: {
        id: "BRW",
        srId: "Brwinów",
        trainPosRange: 0.5,
        platformPosOverride: [20.7185405, 52.1417056]
    },
    PARZ: {
        id: "PARZ",
        srId: "Parzniew",
        trainPosRange: 0.5,
        platformPosOverride: [20.7638017, 52.1570244]
    },
    PRSZ: {
        id: "PRSZ",
        srId: "Pruszków",
        trainPosRange: 0.5,
        platformPosOverride: [20.7978013, 52.1681255,]
    },
    PIA: {
        id: "PIA",
        srId: "Piastów",
        trainPosRange: 0.5,
        platformPosOverride: [20.8422705, 52.1828604]
    },
    WUN: {
        id: "WUN",
        srId: "Warszawa Ursus-Niedźwiadek",
        trainPosRange: 0.5,
        platformPosOverride: [20.8636229, 52.1917853]
    },
    WW: {
        id: "WW",
        srId: "Warszawa Włochy",
        trainPosRange: 0.5,
        platformPosOverride: [20.9139252, 52.2064105]
    },
    WZ: {
        id: "WZ",
        srId: "Warszawa Zachodnia",
        trainPosRange: 0.5,
        platformPosOverride: [20.9634155, 52.2199119]
    },
    WC: {
        id: "WC",
        srId: "Warszawa Centralna",
        trainPosRange: 1,
        platformPosOverride: [20.9956694, 52.2280604]
    },
    SLK: {
        id: "SLK",
        srId: "Sławków",
        trainPosRange: 0.5,
        platformPosOverride: [19.363855828609932, 50.29678842904158]
    },
    BP: {
        id: "BP",
        srId: "Bukowno Przymiarki",
        trainPosRange: 0.5,
        platformPosOverride: [19.408940246926043, 50.27544398936156]
    },
    BK: {
        id: "BK",
        srId: "Bukowno",
        trainPosRange: 0.5,
        platformPosOverride: [19.44932200188971, 50.2680881103723]
    },
    OK: {
        id: "OK",
        srId: "Olkusz",
        trainPosRange: 0.5,
        platformPosOverride: [19.575538540917204, 50.273849734286955]
    },
    JO: {
        id: "JO",
        srId: "Jaroszowiec Olkuski",
        trainPosRange: 0.5,
        platformPosOverride: [19.62183047006975, 50.3462234707999]
    },
    CO: {
        id: "CO",
        srId: "Chrząstowice Olkuskie",
        trainPosRange: 0.5,
        platformPosOverride: [19.681068022809182, 50.343378274263706]
    },
    WB: {
        id: "WB",
        srId: "Wolbrom",
        trainPosRange: 0.5,
        platformPosOverride: [19.76264305679702, 50.377749008835785]
    },
    JZ: {
        id: "JZ",
        srId: "Jeżówka",
        trainPosRange: 0.5,
        platformPosOverride: [19.814474013180256, 50.40013736537004]
    },
    GJ: {
        id: "GJ",
        srId: "Gajówka",
        trainPosRange: 0.5,
        platformPosOverride: [19.87340437337952, 50.40036287198497]
    },
    CH: { // Missing ?
        id: "CH",
        srId: "Charsznica",
        trainPosRange: 0.5,
        platformPosOverride: [19.945038282440226, 50.400941951464155]
    },
    TN: {
        id: "TN",
        srId: "Tunel",
        trainPosRange: 0.5,
        platformPosOverride: [19.992372556576544, 50.43377173453177]
    },
    KOZ: {
        id: "KOZ",
        srId: "Kozłów",
        trainPosRange: 0.5,
        platformPosOverride: [20.0136277706723, 50.47337775311114]
    },
    KLI: {
        id: "KLI",
        srId: "Klimontów",
        trainPosRange: 0.5,
        platformPosOverride: [20.03191066771161, 50.5267955564464]
    },
    SDZ: {
        id: "SDZ",
        srId: "Sędziszów",
        trainPosRange: 0.5,
        platformPosOverride: [20.058531801023246, 50.56829809388203]
    },

    // Temporary routins to avoid "bad" routes to the south for long routes
    // Of course a better approach would be to weight the nodes
    L660_L1WP: {
        id: "L660_L1WP",
        srId: "Line 660 <-> Line 1",
        trainPosRange: 0.1,
        platformPosOverride: [19.274703107423253, 50.311682534342204]
    },
    L660_L2WP: {
        id: "L660_L2WP",
        srId: "Line 660 <-> Line 1",
        trainPosRange: 0.1,
        platformPosOverride: [19.274703107423253, 50.311682534342204]
    },
    R19_WP14: {
        id: "R19_WP14",
        srId: "Line R19",
        trainPosRange: 0.1,
        platformPosOverride: [19.936579673244754, 50.545345355543446]
    }
}

export const postToInternalIds =  _keyBy(Object.values(postConfig).map((pc) => ({
    id: pc.id,
    srId: encodeURIComponent(pc.srId)
})), 'srId');

// console_log("Internal ids map : ", postToInternalIds);


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
    "tjcfK", // Bioxyde
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
    "qATVA", // IpsKevin78
    "xzRkm", // Josef Hmira
    "2GN0n", // CEMO_YTB
    "O3GX3", // WraithCZ
    "4obyd", // mikotomek (PENDING)
    "0BkDQ", // Záhorácká_SimRail.cz
    "memG9", // frantisek.b
    "zy9jV", // Lawliet
    "SEV4t", // redmastercz
    "mYToz", // tpeterka1
    "vkHca", // papiscze
    "dBz72", // papiscze friend
    "qq4QS", // Thomas
    "kN042", // xLars (EN1)
    "XQiP", // Jesit (EN1)
    "9hhA", // Cyclone (EN1)
    "NymO", // p33t
    "GrqY", // marass007
    "eRVx", // tulik74
    "EEN5", // NUB NicDaBoii
    "TSfU", // Milan SSG Owner!w
    "sKOU", // NO_U
    "9vpK", // Mickey007
    "6ViX"  // stacode




];

export const optimizedPostsImagesMap: {[k: string]: any} = {
    GW: GW,
    PS: PS,
    KN: KN,
    WP: WP,
    OL: OL,
    PI: PI,
    KZ: KZ,
    SG: SG,
    DG: DG,
    BN: BN,
    ŁC: LC,
    ZW: ZA,
    OP: OP_PO


}

export const serverTzMap: {[k: string]: string} = {
    FR1: 'Europe/Paris',
    FR2: 'Europe/Paris',
    CZ1: 'Europe/Prague',
    DE1: 'Europe/Paris',
    DE2: 'Europe/Paris',
    DE3: 'Europe/Paris',
    DE4: 'Pacific/Honolulu',
    DE5: 'Europe/Paris',
    UA1: 'Europe/Paris',
    ES1: 'Europe/London',
    ES2: 'America/Argentina/Buenos_Aires',
    EN1: 'Europe/London',
    EN2: 'America/New_York',
    EN3: 'America/Vancouver',
    EN4: 'America/Vancouver',
    EN5: 'America/New_York',
    EN6: 'Asia/Sakhalin',
    EN8: 'Asia/Sakhalin',
    EN9: 'Europe/Paris',
    IT1: 'Europe/Paris',
    PL1: 'Europe/Warsaw',
    PL2: 'Europe/Warsaw',
    PL3: 'US/Hawaii',
    PL4: 'Europe/Warsaw',
    PL5: 'Europe/Warsaw',
    PL6: 'Europe/Warsaw',
    PL7: 'Europe/Warsaw',
    PT1: 'America/Argentina/Buenos_Aires',
    CN1: 'America/Argentina/Buenos_Aires',
}

export const searchSeparator = ',';

export const AllowedServers = Object.keys(serverTzMap).map((s: any) => s.toLowerCase());

console.log("Allowed servers :", AllowedServers);

export const PlatformsConfig = {

}