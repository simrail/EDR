import { Dictionary, NumericDictionary } from "lodash";
import _keyBy from "lodash/keyBy";
import { StationId } from "../enums/stationId";

export type StationConfig = {
    id: string,
    srId: string;
    trainPosRange: number;
    platformPosOverride?: [number, number];
    graphConfig?: {
        pre: string[],
        post: string[],
        final: string[] // N+1 post from what is displayed at the bottom to know if the train is going to KZ
    }
    secondaryPosts?: string[]
}

type StationNeighbours = {
    down?: Array<StationId>
    left?: Array<StationId>;
    right?: Array<StationId>;
    up?: Array<StationId>;
}

export const dispatchDirections: NumericDictionary<StationNeighbours> = {
    [StationId.Katowice_Zawodzie]: {
        left: [StationId.Sosnowiec_Gl_pzs_R52],
        right: [StationId.Katowice]
    },
    [StationId.Sosnowiec_Gl_pzs_R52]: {
        down: [StationId.Sosnowiec_Poludniowy],
        left: [StationId.Katowice_Zawodzie],
        right: [StationId.Sosnowiec_Glowny]
    },
    [StationId.Sosnowiec_Glowny]: {
        down: [StationId.Sosnowiec_Poludniowy],
        left: [StationId.Sosnowiec_Gl_pzs_R52],
        right: [StationId.Bedzin]
    },
    [StationId.Bedzin]: {
        left: [StationId.Sosnowiec_Glowny],
        right: [StationId.Dabrowa_Gornicza]
    },
    [StationId.Dabrowa_Gornicza]: {
        left: [StationId.Bedzin],
        right: [StationId.Dabrowa_Gornicza_Zabkowice]
    },
    [StationId.Dabrowa_Gornicza_Zabkowice]: {
        left: [StationId.Dabrowa_Gornicza, StationId.Dabrowa_Gornicza_Huta_Katowice_R7, StationId.Dabrowa_Gornicza_Huta_Katowice],
        right: [StationId.Dabrowa_Gornicza_Zabkowice_DZA, StationId.Dabrowa_Gornicza_Zabkowice_DZA_R4_7, StationId.Lazy_Lc]
    },
    [StationId.Lazy_Lc]: {
        left: [StationId.Lazy],
        right: [StationId.Dabrowa_Gornicza_Zabkowice, StationId.Dabrowa_Gornicza_Zabkowice_DZA, StationId.Dabrowa_Gornicza_Zabkowice_DZA_R4_7, StationId.Przemiarki]
    },
    [StationId.Zawiercie]: {
        left: [StationId.Lazy_La],
        right: [StationId.Myszkow, StationId.Gora_Wlodowska]
    },
    [StationId.Gora_Wlodowska]: {
        left: [StationId.Zawiercie],
        right: [StationId.Psary]
    },
    [StationId.Psary]: {
        down: [StationId.Starzyny, StationId.Starzyny_R5],
        left: [StationId.Gora_Wlodowska],
        right: [StationId.Knapowka]
    },
    [StationId.Knapowka]: {
        down: [StationId.Czarnca, StationId.Czarnca_R19],
        left: [StationId.Psary],
        right: [StationId.Wloszczowa_Polnoc]
    },
    [StationId.Wloszczowa_Polnoc]: {
        left: [StationId.Knapowka],
        right: [StationId.Olszamowice],
        up: [StationId.Zelislawice, StationId.Zelislawice_R6]
    },
    [StationId.Olszamowice]: {
        left: [StationId.Pilichowice],
        right: [StationId.Wloszczowa_Polnoc]
    },
    [StationId.Pilichowice]: {
        left: [StationId.Opoczno_Poludnie],
        right: [StationId.Olszamowice]
    },
    [StationId.Opoczno_Poludnie]: {
        left: [StationId.Pilichowice],
        right: [StationId.Idzikowice]
    },
    [StationId.Idzikowice]: {
        down: [StationId.Radzice_R12, StationId.Radzice],
        left: [StationId.Opoczno_Poludnie],
        right: [StationId.Strzalki],
        up: [StationId.Radzice_pzs_R31],
    },
    [StationId.Grodzisk_Mazowiecki]: {
        left: [StationId.Pruszkow],
        right: [StationId.Zyrardow, StationId.Korytow]
    },
    [StationId.Sosnowiec_Poludniowy]: {
        left: [StationId.Sosnowiec_Glowny],
        right: [StationId.Sosnowiec_Dandowka],
        down: [StationId.Sosnowiec_Gl_pzs_R52]
    },
    [StationId.Dabrowa_Gornicza_Wschodnia]: {
        left: [StationId.Dabrowa_Gornicza_Strzemieszyce_R75, StationId.Dabrowa_Gornicza_Strzemieszyce, StationId.Dorota],
        right: [StationId.Slawkow, StationId.Koziol_R12, StationId.Koziol]
    },
    [StationId.Dorota]: {
        left: [StationId.Juliusz, StationId.Sosnowiec_Maczki],
        right: [StationId.Dabrowa_Gornicza_Wschodnia, StationId.Dabrowa_Gornicza_Poludniowa]
    },
    [StationId.Korytow]: {
        left: [StationId.Szeligi],
        right: [StationId.Grodzisk_Mazowiecki]
    },
    [StationId.Szeligi]: {
        left: [StationId.Biala_Rawska],
        right: [StationId.Korytow]
    }
}

export const internalIdToPointId: {[k: string]: number} = {
    "T1_BZ": 124,
    "BZ": 124,
    "LZ_LC": 2375,
    "SG_R52": 3991,
    "SG": 3993,
    "DG": 719,
    "GW": 1193,
    "PS": 3436,
    "KN": 1772,
    "WP": 4987,
    "OZ": 2969,
    "PI": 3200,
    "OP_PO": 2993,
    "ZA": 5262,
    "DG_WZ": 733,
    "SP": 4010,
    "IDZ": 1349,
    "KZ": 1655,
    "SG_PO": 4010,
    "GRO_MAZ": 1251
}

export const postConfig: Dictionary<StationConfig> = {
    GW: {
        id: "GW",
        srId: "Góra Włodowska",
        trainPosRange: 0.5,
        platformPosOverride: [19.470318, 50.584134],
        graphConfig: {
            pre: ["LZ_LC", "ZA"],
            post: ["PS", "KN"],
            final: ["WP"]
        }
    },
    PS: {
        id: "PS",
        srId: "Psary",
        trainPosRange: 0.5,
        platformPosOverride: [19.820087, 50.735068],
        graphConfig: {
            pre: ["ZA", "GW"],
            post: ["KN", "WP"],
            final: ["OZ"]
        }
    },
    KN: {
        id: "KN",
        srId: "Knapówka", // TODO: Missing data
        trainPosRange: 0.5,
        platformPosOverride: [19.9049155, 50.8001411],
        graphConfig: {
            pre: ["GW", "PS"],
            post: ["WP", "OZ"],
            final: ["PI"]
        }
    },
    WP: {
        id: "WP",
        srId: "Włoszczowa Północ",
        trainPosRange: 0.5,
        platformPosOverride: [19.945774, 50.856198],
        graphConfig: {
            pre: ["PS", "KN"],
            post: ["OZ", "PI"],
            final: ["OP_PO"]
        }
    },
    OZ: {
        id: "OZ",
        srId: "Olszamowice", // TODO: Missing data
        trainPosRange: 0.5,
        platformPosOverride: [20.0645106, 51.0955558],
        graphConfig: {
            pre: ["KN", "WP"],
            post: ["PI", "OP_PO"],
            final: ["IDZ"]
        }

    },
    PI: {
        id: "PI",
        srId: "Pilichowice", // TODO: Missing data
        trainPosRange: 0.5,
        platformPosOverride: [20.1210684, 51.2546948],
        graphConfig: {
            pre: ["KN", "WP", "OZ"],
            post: ["OP_PO", "IDZ"],
            final: ["STR"]
        }
    },
    KZ: {
        id: "KZ",
        srId: "Katowice Zawodzie",
        trainPosRange: 0.5,
        platformPosOverride: [19.057551, 50.257280],
        graphConfig: {
            post: [],
            pre: ["DG", "T1_BZ", "SG"],
            final: ["KO"]
        }
    },
    SG: {
        id: "SG",
        srId: "Sosnowiec Główny",
        trainPosRange: 1,
        platformPosOverride: [19.1270833, 50.2793889],
        graphConfig: {
            pre: ["LZ_LC", "DG", "T1_BZ"],
            post: ["KZ"],
            final: []
        },
        secondaryPosts: ["SG_R52"]
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
        platformPosOverride: [19.1255985, 50.2695509],
        graphConfig: {
            pre: ["KZ", "SG"],
            post: ["DG_WZ"],
            final: []
        },
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
        platformPosOverride: [19.1418582, 50.3085335],
        graphConfig: {
            pre: ["LZ_LC", "DG"],
            post: ["SG", "KZ"],
            final: []
        }
    },
    LZ_LC: {
        id: "LZ_LC",
        srId:"Łazy Łc",
        platformPosOverride: [19.362862, 50.416436],
        trainPosRange: 0.5,
        graphConfig: {
            pre: ["GW", "ZA"],
            post: ["DG", "T1_BZ"],
            final: []
        }
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
        platformPosOverride: [20.232192, 51.358965],
        graphConfig: {
            pre: ["WP", "OZ", "PI"],
            post: ["IDZ"],
            final: ["STR"]
        }
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
        platformPosOverride: [19.423131, 50.481001],
        graphConfig: {
            pre: ["PS", "GW"],
            post: ["LZ_LC","DG" ],
            final: ["T1_BZ"]
        }
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
        platformPosOverride: [19.184696, 50.330386],
        graphConfig: {
            pre: ["ZA", "LZ_LC"],
            post: ["T1_BZ", "SG"],
            final: ["KZ"]
        }
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
        platformPosOverride: [19.31384974905758, 50.306421359840016],
        graphConfig: {
            pre: ["KZ", "SG"],
            post: ["LZ_LC"],
            final: []
        }
    },
    DOR: {
        id: "DOR",
        srId: "Dorota",
        trainPosRange: 0.5,
        platformPosOverride: [19.282166, 50.285434]
    },
    DG_ST: {
        id: "DG_ST",
        srId: "Dąbrowa Górnicza Strzemieszyce",
        trainPosRange: 0.5,
        platformPosOverride: [19.268989, 50.3116203]
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
        platformPosOverride: [20.3161252, 51.4497225],
        graphConfig: {
            pre: ["WP", "OZ", "PI", "OP_PO"],
            post: [],
            final: ["STR"]
        }
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
    KOR: {
        id: "KOR",
        srId: "Korytów",
        trainPosRange: 0.5,
        platformPosOverride: [20.495777, 52.022659]
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
    R19_WP14: {
        id: "R19_WP14",
        srId: "Line R19",
        trainPosRange: 0.1,
        platformPosOverride: [19.936579673244754, 50.545345355543446]
    },
    RDZ_P31: {
        id: "RDZ_P31",
        srId: "Radzice PZS R31",
        trainPosRange: 0.5,
        platformPosOverride: [20.338202, 51.483653]
    },
    RDZ_R12: {
        id: "RDZ_R12",
        srId: "Radzice R12",
        trainPosRange: 0.5,
        platformPosOverride: [20.340260, 51.482987, ]
    },
    ZEL_R6: {
        id: "ZEL_R6",
        srId: "Żelisławice R.6",
        trainPosRange: 0.5,
        platformPosOverride: [19.859630, 50.804040]
    },
    ZYR: {
        id: "ZYR",
        srId: "Żyrardów",
        trainPosRange: 0.5,
        platformPosOverride: [20.448360, 52.052271]
    },
    KOZ_R12: {
        id: "KOZ_R12",
        srId: "Kozioł R12",
        trainPosRange: 0.5,

    },
    PRZ: {
        id: "PRZ",
        srId: "Przemiarki",
        trainPosRange: 0.5,
        platformPosOverride: [19.340207, 50.385943]
    },
    DG_T_R5: {
        id: "DG_T_R5",
        srId: "Dąbrowa Górnicza Towarowa DTA R5",
        trainPosRange: 0.5,
        platformPosOverride: [19.377485, 50.329225]
    },
    KOZI: {
        id: "KOZI",
        srId: "Kozioł",
        trainPosRange: 0.5,
        platformPosOverride: [19.382807, 50.308508]
    },
    KOZI_R12: {
        id: "KOZI_R12",
        srId: "Kozioł R12",
        trainPosRange: 0.5,
        platformPosOverride: [19.358590, 50.299019]
    },
}

export const postToInternalIds =  _keyBy(Object.values(postConfig).map((pc) => ({
    id: pc.id,
    srId: encodeURIComponent(pc.srId)
})), 'srId');
