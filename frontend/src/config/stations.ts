import { Dictionary, NumericDictionary } from "lodash";
import _keyBy from "lodash/keyBy";
import { StationId } from "../enums/stationId";

export type StationConfig = {
    id: string,
    srName: string;
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
    [StationId.katowice_zawodzie]: {
        left: [StationId.sosnowiec_gl__pzs_r52, StationId.szabelnia, StationId.katowice_szopienice_poludniowe],
        right: [StationId.katowice]
    },
    [StationId.sosnowiec_gl__pzs_r52]: {
        down: [StationId.sosnowiec_poludniowy],
        left: [StationId.katowice_zawodzie, StationId.katowice_szopienice_poludniowe],
        right: [StationId.sosnowiec_glowny]
    },
    [StationId.sosnowiec_glowny]: {
        down: [StationId.sosnowiec_poludniowy],
        left: [StationId.sosnowiec_gl__pzs_r52, StationId.katowice_szopienice_poludniowe],
        right: [StationId.bedzin]
    },
    [StationId.bedzin]: {
        left: [StationId.sosnowiec_glowny],
        right: [StationId.dabrowa_gornicza, StationId.bedzin_miasto]
    },
    [StationId.dabrowa_gornicza]: {
        left: [StationId.bedzin, StationId.bedzin_ksawera],
        right: [StationId.dabrowa_gornicza_zabkowice, StationId.dabrowa_gornicza_golonog]
    },
    [StationId.dabrowa_gornicza_zabkowice]: {
        left: [StationId.dabrowa_gornicza, StationId.dabrowa_gornicza_huta_katowice_r7, StationId.dabrowa_gornicza_huta_katowice, StationId.dabrowa_gornicza_golonog, StationId.dabrowa_gornicza_zabkowice_gtb, StationId.dabrowa_gornicza_pogoria],
        right: [StationId.dabrowa_gornicza_zabkowice_dza, StationId.dabrowa_gorn__zabkowice_dza_r_47, StationId.lazy_lc]
    },
    [StationId.lazy]: {
        left: [StationId.lazy_lc],
        right: [StationId.lazy_la, StationId.lazy_r52, StationId.lazy_grupa_weglarkowa_lgw]
    },
    [StationId.lazy_la]: {
        left: [StationId.lazy, StationId.lazy_r52],
        right: [StationId.zawiercie, StationId.zawiercie_gt],
    },
    [StationId.lazy_lc]: {
        left: [StationId.lazy],
        right: [StationId.dabrowa_gornicza_zabkowice, StationId.dabrowa_gornicza_zabkowice_dza, StationId.dabrowa_gorn__zabkowice_dza_r_47, StationId.przemiarki, StationId.wiesiolka]
    },
    [StationId.zawiercie]: {
        left: [StationId.lazy_la, StationId.zawiercie_gt],
        right: [StationId.myszkow, StationId.myszkow_gt, StationId.gora_wlodowska, StationId.zawiercie_borowe_pole]
    },
    [StationId.gora_wlodowska]: {
        left: [StationId.zawiercie],
        right: [StationId.psary, StationId.psary_roz_40]
    },
    [StationId.psary]: {
        down: [StationId.starzyny, StationId.starzyny_r5, StationId.psary_roz_40],
        left: [StationId.gora_wlodowska],
        right: [StationId.knapowka]
    },
    [StationId.knapowka]: {
        down: [StationId.czarnca, StationId.czarnca_, StationId.knapowka_r2],
        left: [StationId.psary],
        right: [StationId.wloszczowa_polnoc]
    },
    [StationId.wloszczowa_polnoc]: {
        left: [StationId.knapowka, StationId.knapowka_r2],
        right: [StationId.olszamowice],
        up: [StationId.zelislawice]
    },
    [StationId.olszamowice]: {
        left: [StationId.pilichowice],
        right: [StationId.wloszczowa_polnoc]
    },
    [StationId.pilichowice]: {
        left: [StationId.opoczno_poludnie],
        right: [StationId.olszamowice]
    },
    [StationId.opoczno_poludnie]: {
        left: [StationId.pilichowice],
        right: [StationId.idzikowice]
    },
    [StationId.idzikowice]: {
        down: [StationId.radzice],
        left: [StationId.opoczno_poludnie],
        right: [StationId.strzalki, StationId.idzikowice_roz_18],
        up: [StationId.radzice_pzs_r31],
    },
    [StationId.grodzisk_mazowiecki]: {
        left: [StationId.pruszkow, StationId.milanowek, StationId.grodzisk_maz__r58],
        right: [StationId.zyrardow, StationId.korytow, StationId.grodzisk_mazowiecki_r64]
    },
    [StationId.sosnowiec_poludniowy]: {
        left: [StationId.sosnowiec_glowny],
        right: [StationId.sosnowiec_dandowka],
        down: [StationId.sosnowiec_gl__pzs_r52]
    },
    [StationId.dabrowa_gornicza_wschodnia]: {
        left: [StationId.dabr_gor_strzem__r75, StationId.dabrowa_gornicza_strzemieszyce, StationId.dorota],
        right: [StationId.slawkow, StationId.koziol_r12, StationId.koziol]
    },
    [StationId.dorota]: {
        left: [StationId.juliusz, StationId.sosnowiec_maczki],
        right: [StationId.dabrowa_gornicza_wschodnia, StationId.dabrowa_gornicza_poludniowa]
    },
    [StationId.korytow]: {
        left: [StationId.szeligi],
        right: [StationId.grodzisk_mazowiecki, StationId.grodzisk_maz__r58]
    },
    [StationId.szeligi]: {
        left: [StationId.biala_rawska],
        right: [StationId.korytow]
    },
    [StationId.biala_rawska]: {
        left: [StationId.strzalki],
        right: [StationId.szeligi]
    },
    [StationId.strzalki]: {
        left: [StationId.idzikowice, StationId.idzikowice_roz_12],
        right: [StationId.biala_rawska]
    },
    [StationId.juliusz]: {
        left: [StationId.sosnowiec_dandowka],
        right: [StationId.dorota]
    },
    [StationId.katowice]: {
        left: [StationId.brynow, StationId.katowice_tow__ktc, StationId.katowice_zaleze],
        right: [StationId.katowice_zawodzie]
    },
    [StationId.slawkow]: {
        left: [StationId.bukowno, StationId.bukowno_przymiarki],
        right: [StationId.dabrowa_gornicza_wschodnia]
    },
    [StationId.dabrowa_gornicza_huta_katowice]: {
        left: [StationId.dabrowa_gornicza_strzemieszyce, StationId.dabrowa_gornicza_poludniowa, StationId.dabr_gor_strzem__r75],
        right: [StationId.dabrowa_gornicza_zabkowice, StationId.dabrowa_gornicza_zabkowice_gtb, StationId.dabrowa_gornicza_huta_katowice_r7],
    },
    [StationId.sosnowiec_kazimierz]: {
        left: [StationId.dabrowa_gornicza_strzemieszyce, StationId.dabr_gor_strzem__r75],
        right: [StationId.sosnowiec_maczki, StationId.sosnowiec_dandowka, StationId.sosnowiec_kazimierz_pzs_skz1, StationId.sosnowiec_kazimierz_pzs_skz2],
    },
    [StationId.bukowno]: {
        left: [StationId.slawkow, StationId.bukowno_przymiarki],
        right: [StationId.olkusz],
    },
    [StationId.tunel]: {
        left: [StationId.kozlow],
        right: [StationId.miechow, StationId.charsznica, StationId.tunel_r13],
    },
    [StationId.kozlow]: {
        left: [StationId.tunel, StationId.tunel_r13],
        right: [StationId.sprowa, StationId.sedziszow, StationId.klimontow],
    },
    [StationId.pruszkow]: {
        left: [StationId.warszawa_wlochy, StationId.jozefinow, StationId.jozefinow_roz_2, StationId.piastow],
        right: [StationId.grodzisk_mazowiecki, StationId.parzniew],
    },
    [StationId.krakow_batowice]: {
        left: [StationId.dlubnia, StationId.raciborowice],
        right: [StationId.krakow_mydlniki, StationId.krakow_przedmiescie],
    },
    [StationId.krakow_przedmiescie]: {
        left: [StationId.krakow_batowice],
        right: [StationId.krakow_przedmiescie_r3, StationId.krakow_olsza, StationId.krakow_glowny, StationId.krakow_glowny_kga],
    },
    [StationId.miechow]: {
        left: [StationId.slomniki, StationId.kamienczyce],
        right: [StationId.tunel, StationId.dziadowki],
    },
    [StationId.niedzwiedz]: {
        left: [StationId.slomniki, StationId.slomniki_miasto],
        right: [StationId.zastow, StationId.goszcza],
    },
    [StationId.raciborowice]: {
        left: [StationId.zastow],
        right: [StationId.krakow_batowice, StationId.dlubnia, StationId.dlubnia_r2],
    },
    [StationId.slomniki]: {
        left: [StationId.niedzwiedz, StationId.slomniki_miasto],
        right: [StationId.miechow, StationId.smrokow],
    },
    [StationId.zastow]: {
        left: [StationId.niedzwiedz, StationId.baranowka],
        right: [StationId.raciborowice],
    },
    [StationId.starzyny]: {
        left: [StationId.kozlow, StationId.starzyny_r5, StationId.sprowa],
        right: [StationId.koniecpol, StationId.psary, StationId.psary_roz_40],
    },
    [StationId.galkowek]: {
        left: [StationId.koluszki_pzs_r145, StationId.zakowice, StationId.zakowice_poludniowe],
        right: [StationId.lodz_olechow_loc, StationId.justynow, StationId.lodz_andrzejow]
    },
    [StationId.koluszki]: {
        left: [StationId.koluszki_r59, StationId.rogow],
        right: [StationId.koluszki_r121, StationId.koluszki_pzs_r145, StationId.koluszki_pzs_r154]
    },
    [StationId.lodz_widzew]: {
        left: [StationId.lodz_widzew_r9, StationId.lodz_widzew_pzs_r3],
        right: [StationId.lodz_andrzejow]
    },
    [StationId.plycwia]: {
        left: [StationId.skierniewice_p_pzs, StationId.makow],
        right: [StationId.plycwia_gt],
    },
    [StationId.rogow]: {
        left: [StationId.wagry, StationId.koluszki, StationId.koluszki_r59],
        right: [StationId.plycwia_gt, StationId.przylek_duzy]
    },
    [StationId.skierniewice]: {
        left: [StationId.skierniewice_p_pzs, StationId.skierniewice_s_pzs],
        right: [StationId.skierniewice_gt_201_208]
    },
    [StationId.warszawa_wlochy]: {
        left: [StationId.jozefinow, StationId.warszawa_ursus_polnocny, StationId.warszawa_ursus],
        right: [StationId.warszawa_zachodnia],
        up: [StationId.warszawa_golabki]
    },
    [StationId.zakowice_poludniowe]: {
        left: [StationId.zakowice_pld_roz_5],
        right: [StationId.galkowek]
    },
    [StationId.zyrardow]: {
        left: [StationId.radziwillow_mazowiecki, StationId.sucha_zyrardowska],
        right: [StationId.miedzyborow, StationId.grodzisk_mazowiecki, StationId.grodzisk_mazowiecki_r64],
    }
}

export const postConfig: Dictionary<StationConfig> = {
    GW: {
        id: "GW",
        srName: "Góra Włodowska",
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
        srName: "Psary",
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
        srName: "Knapówka",
        trainPosRange: 0.5,
        platformPosOverride: [19.904915, 50.800141],
        graphConfig: {
            pre: ["GW", "PS"],
            post: ["WP", "OZ"],
            final: ["PI"]
        }
    },
    WP: {
        id: "WP",
        srName: "Włoszczowa Północ",
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
        srName: "Olszamowice", // TODO: Missing data
        trainPosRange: 0.5,
        platformPosOverride: [20.064510, 51.095555],
        graphConfig: {
            pre: ["KN", "WP"],
            post: ["PI", "OP_PO"],
            final: ["IDZ"]
        }

    },
    PI: {
        id: "PI",
        srName: "Pilichowice", // TODO: Missing data
        trainPosRange: 0.5,
        platformPosOverride: [20.121068, 51.254694],
        graphConfig: {
            pre: ["KN", "WP", "OZ"],
            post: ["OP_PO", "IDZ"],
            final: ["ST"]
        }
    },
    KZ: {
        id: "KZ",
        srName: "Katowice Zawodzie",
        trainPosRange: 0.5,
        platformPosOverride: [19.057551, 50.257280],
        graphConfig: {
            post: [],
            pre: ["DG", "B", "SG"],
            final: ["KO"]
        }
    },
    SG: {
        id: "SG",
        srName: "Sosnowiec Główny",
        trainPosRange: 1,
        platformPosOverride: [19.127083, 50.279388],
        graphConfig: {
            pre: ["LZ_LC", "DG", "B"],
            post: ["KZ"],
            final: []
        },
        secondaryPosts: ["SG_R52"]
    },
    SG_R52: {
        id: "SG_R52",
        srName: "Sosnowiec Gł. pzs R52",
        trainPosRange: 1,
        platformPosOverride: [19.114761, 50.272224]
    },
    SG_PO: {
        id: "SG_PO",
        srName: "Sosnowiec Południowy",
        trainPosRange: 0.5,
        platformPosOverride: [19.125598, 50.269550],
        graphConfig: {
            pre: ["KZ", "SG"],
            post: ["DG_WZ"],
            final: []
        },
    },
    SG_DK: {
        id: "SG_DK",
        srName: "Sosnowiec Dańdówka",
        trainPosRange: 0.5,
        platformPosOverride: [19.177154, 50.266830],
        graphConfig: {
            pre: ["KZ", "SG_PO"],
            post: ["JU", "DOR"],
            final: []
        }
    },
    SG_POR: {
        id: "SG_POR",
        srName: "Sosnowiec Porąbka",
        trainPosRange: 0.5,
        platformPosOverride: [19.226053, 50.277019],

    },
    SG_KAZ: {
        id: "SG_KAZ",
        srName: "Sosnowiec Kazimierz",
        trainPosRange: 0.5,
        platformPosOverride: [19.231430, 50.288483],
        graphConfig: {
            pre: ["DG_ST"],
            post: ["DOR"],
            final: []
        }
    },
    B: {
        id: "B",
        srName: "Będzin",
        trainPosRange: 0.5,
        platformPosOverride: [19.141858, 50.308533],
        graphConfig: {
            pre: ["LZ_LC", "DG"],
            post: ["SG", "KZ"],
            final: []
        }
    },
    LZ_LC: {
        id: "LZ_LC",
        srName:"Łazy Łc",
        platformPosOverride: [19.362862, 50.416436],
        trainPosRange: 0.5,
        graphConfig: {
            pre: ["GW", "ZA"],
            post: ["DG", "B"],
            final: []
        }
    },
    LZ_LB: {
        id: "LZ_LB",
        srName:"Łazy",
        trainPosRange: 0.5,
        platformPosOverride: [19.391998, 50.430172],
        graphConfig: {
            pre: ["LZ_LC"],
            post: ["LZ_LA"],
            final: [],
        },
    },
    LZ_LA : {
        id: "LZ_LA",
        srName: "Łazy Ła",
        trainPosRange: 0.5,
        platformPosOverride: [19.420255, 50.453892],
        graphConfig: {
            pre: ["LZ_LB"],
            post: ["ZA"],
            final: [],
        },
    },
    OP_PO: {
        id: "OP_PO",
        srName:"Opoczno Południe",
        trainPosRange: 0.5,
        platformPosOverride: [20.232192, 51.358965],
        graphConfig: {
            pre: ["WP", "OZ", "PI"],
            post: ["IDZ"],
            final: ["ST"]
        }
    },
    MY: {
        id: "MY",
        srName:"Myszków",
        trainPosRange: 0.5,
        platformPosOverride: [19.327265, 50.564696]
    },
    MY_MR: {
        id: "MY_MR",
        srName:"Myszków Mrzygłód",
        trainPosRange: 0.5,
        platformPosOverride: [19.377319, 50.543482]
    },
    ZA_BO_PO: {
        id: "ZA_BO_PO",
        srName:"Zawiercie Borowe Pole",
        trainPosRange: 0.5,
        platformPosOverride: [19.398674, 50.511076]
    },
    ZA: {
        id: "ZA",
        srName:"Zawiercie",
        trainPosRange: 0.5,
        platformPosOverride: [19.423131, 50.481001],
        graphConfig: {
            pre: ["PS", "GW"],
            post: ["LZ_LC","DG" ],
            final: ["B"]
        }
    },
    WI: {
        id: "WI",
        srName:"Wiesiółka",
        trainPosRange: 0.5,
        platformPosOverride: [19.349172, 50.414688]
    },
    CZ: {
        id: "CZ",
        srName:"Chruszczobród",
        trainPosRange: 0.5,
        platformPosOverride: [19.329007, 50.400345]
    },
    DG: {
        id: "DG",
        srName: "Dąbrowa Górnicza",
        trainPosRange: 0.5,
        platformPosOverride: [19.184696, 50.330386],
        graphConfig: {
            pre: ["ZA", "LZ_LC"],
            post: ["B", "SG"],
            final: ["KZ"]
        }
    },
    DG_SI: {
        id: "DG_SI",
        srName:"Dąbrowa Górnicza Sikorka",
        trainPosRange: 0.5,
        platformPosOverride: [19.299095, 50.388950]
    },
    DG_ZA: {
        id: "DG_ZA",
        srName:"Dąbrowa Górnicza Ząbkowice",
        trainPosRange: 0.5,
        platformPosOverride: [19.264612, 50.366385]
    },
    DG_DZA: {
        id: "DG_DZA",
        srName: "Dąbrowa Górnicza Ząbkowice DZA",
        trainPosRange: 0.5,
        platformPosOverride: [19.272576, 50.375841]
    },
    DG_DZA_R47: {
        id: "DG_DZA_R47",
        srName: "Dąbrowa Górn. Ząbkowice DZA R.4/7",
        trainPosRange: 0.5,
        platformPosOverride: [19.272576, 50.375841]
    },
    DG_PO: {
        id: "DG_PO",
        srName:"Dąbrowa Górnicza Pogoria",
        trainPosRange: 0.5,
        platformPosOverride: [19.240848, 50.350499]
    },
    DG_GO: {
        id: "DG_GO",
        srName:"Dąbrowa Górnicza Gołonóg",
        trainPosRange: 0.5,
        platformPosOverride: [19.225709, 50.343768]
    },
    DG_WZ: {
        id: "DG_WZ",
        srName: "Dąbrowa Górnicza Wschodnia",
        trainPosRange: 0.5,
        platformPosOverride: [19.310332, 50.303395],
        graphConfig: {
            pre: ["JU", "DOR"],
            post: ["BK", "OK"],
            final: []
        }
    },
    DOR: {
        id: "DOR",
        srName: "Dorota",
        trainPosRange: 0.5,
        platformPosOverride: [19.282166, 50.285434],
        graphConfig: {
            pre: ["SG_DK", "JU"],
            post: ["DG_WZ", "BK"],
            final: [],
        }
    },
    DG_ST: {
        id: "DG_ST",
        srName: "Dąbrowa Górnicza Strzemieszyce",
        trainPosRange: 0.5,
        platformPosOverride: [19.268989, 50.311620]
    },
    BZ_KS: {
        id: "BZ_KS",
        srName:"Będzin Ksawera",
        trainPosRange: 0.5,
        platformPosOverride: [19.157925, 50.330515]
    },
    BZ_MI: {
        id: "BZ_MI",
        srName:"Będzin Miasto",
        trainPosRange: 0.5,
        platformPosOverride: [19.135523, 50.319178]
    },
    KSP: {
        id: "KSP",
        srName:"Katowice Szopienice Południowe",
        trainPosRange: 0.5,
        platformPosOverride: [19.092237, 50.258875]
    },
    KO: {
        id: "KO",
        srName:"Katowice",
        trainPosRange: 0.5,
        platformPosOverride: [19.017109, 50.257589]
    },
    CZ_R19: {
        id: "CZ_R19",
        srName: "Czarnca R19",
        trainPosRange: 0.5,
        platformPosOverride: [19.944717, 50.823259]
    },
    STZ: {
        id: "STZ",
        srName: "Starzyny",
        trainPosRange: 0.5,
        platformPosOverride: [19.813349, 50.694149]
    },
    IDZ: {
        id: "IDZ",
        srName: "Idzikowice",
        trainPosRange: 1,
        platformPosOverride: [20.316125, 51.449722],
        graphConfig: {
            pre: ["PI", "OP_PO"],
            post: ["ST", "BR"],
            final: []
        }
    },
    ST: {
        id: "ST",
        srName: "Strzałki",
        trainPosRange: 1,
        platformPosOverride: [20.406687, 51.642870],
        graphConfig: {
            pre: ["OP_PO", "IDZ"],
            post: ["BR", "SZE"],
            final: []
        }
    },
    BR: {
        id: "BR",
        srName: "Biała Rawska",
        trainPosRange: 1,
        platformPosOverride: [20.439459, 51.794781],
        graphConfig: {
            pre: ["IDZ", "ST"],
            post: ["SZE", "KOR"],
            final: [],
        }
    },
    SZE: {
        id: "SZE",
        srName: "Szeligi",
        trainPosRange: 1,
        platformPosOverride: [20.457199, 51.942969],
        graphConfig: {
            pre: ["ST", "BR"],
            post: ["KOR", "GRO_MAZ"],
            final: []
        }
    },
    JKT: {
        id: "JKT",
        srName: "Jaktorów",
        trainPosRange: 1,
        platformPosOverride: [20.552015, 52.086808]
    },
    GRO_MAZ: {
        id: "GRO_MAZ",
        srName: "Grodzisk Mazowiecki",
        trainPosRange: 0.5,
        platformPosOverride: [20.6231492, 52.1101932],
        graphConfig: {
            pre: ["SZE", "KOR"],
            post: ["PRSZ", "WW"],
            final: []
        }
    },
    MIL: {
        id: "MIL",
        srName: "Milanówek",
        trainPosRange: 0.5,
        platformPosOverride: [20.667040, 52.124888]
    },
    BRW: {
        id: "BRW",
        srName: "Brwinów",
        trainPosRange: 0.5,
        platformPosOverride: [20.718540, 52.141705]
    },
    PARZ: {
        id: "PARZ",
        srName: "Parzniew",
        trainPosRange: 0.5,
        platformPosOverride: [20.763801, 52.157024]
    },
    KOR: {
        id: "KOR",
        srName: "Korytów",
        trainPosRange: 0.5,
        platformPosOverride: [20.495777, 52.022659],
        graphConfig: {
            pre: ["BR", "SZE"],
            post: ["GRO_MAZ", "PRSZ"],
            final: []
        }
    },
    PRSZ: {
        id: "PRSZ",
        srName: "Pruszków",
        trainPosRange: 0.5,
        platformPosOverride: [20.798650, 52.168203],
        graphConfig: {
            pre: ["KOR", "GRO_MAZ"],
            post: [],
            final: ["WW"]
        }
    },
    PIA: {
        id: "PIA",
        srName: "Piastów",
        trainPosRange: 0.5,
        platformPosOverride: [20.842270, 52.182860]
    },
    WUN: {
        id: "WUN",
        srName: "Warszawa Ursus-Niedźwiadek",
        trainPosRange: 0.5,
        platformPosOverride: [20.863622, 52.191785]
    },
    WW: {
        id: "WW",
        srName: "Warszawa Włochy",
        trainPosRange: 0.5,
        platformPosOverride: [20.913925, 52.206410]
    },
    WZ: {
        id: "WZ",
        srName: "Warszawa Zachodnia",
        trainPosRange: 0.5,
        platformPosOverride: [20.963415, 52.219911]
    },
    WC: {
        id: "WC",
        srName: "Warszawa Centralna",
        trainPosRange: 1,
        platformPosOverride: [20.995669, 52.228060]
    },
    SLK: {
        id: "SLK",
        srName: "Sławków",
        trainPosRange: 0.5,
        platformPosOverride: [19.363855, 50.296788]
    },
    BP: {
        id: "BP",
        srName: "Bukowno Przymiarki",
        trainPosRange: 0.5,
        platformPosOverride: [19.408940, 50.275443]
    },
    BK: {
        id: "BK",
        srName: "Bukowno",
        trainPosRange: 0.5,
        platformPosOverride: [19.458295, 50.263935],
        graphConfig: {
            pre: ["SLK"],
            post: ["OK"],
            final: []
        }
    },
    OK: {
        id: "OK",
        srName: "Olkusz",
        trainPosRange: 0.5,
        platformPosOverride: [19.575538, 50.273849]
    },
    JO: {
        id: "JO",
        srName: "Jaroszowiec Olkuski",
        trainPosRange: 0.5,
        platformPosOverride: [19.621830, 50.346223]
    },
    CO: {
        id: "CO",
        srName: "Chrząstowice Olkuskie",
        trainPosRange: 0.5,
        platformPosOverride: [19.681068, 50.343378]
    },
    WB: {
        id: "WB",
        srName: "Wolbrom",
        trainPosRange: 0.5,
        platformPosOverride: [19.762643, 50.377749]
    },
    JZ: {
        id: "JZ",
        srName: "Jeżówka",
        trainPosRange: 0.5,
        platformPosOverride: [19.814474, 50.400137]
    },
    GJ: {
        id: "GJ",
        srName: "Gajówka",
        trainPosRange: 0.5,
        platformPosOverride: [19.873404, 50.400362]
    },
    CH: {
        id: "CH",
        srName: "Charsznica",
        trainPosRange: 0.5,
        platformPosOverride: [19.945038, 50.400941]
    },
    TN: {
        id: "TN",
        srName: "Tunel",
        trainPosRange: 0.5,
        platformPosOverride: [19.991247, 50.433672],
        graphConfig: {
            pre: ["KOZ"],
            post: ["CH"],
            final: []
        },
    },
    KOZ: {
        id: "KOZ",
        srName: "Kozłów",
        trainPosRange: 0.5,
        platformPosOverride: [20.012298, 50.474814],
        graphConfig: {
            pre: ["TN"],
            post: ["SDZ"],
            final: []
        }
    },
    KLI: {
        id: "KLI",
        srName: "Klimontów",
        trainPosRange: 0.5,
        platformPosOverride: [20.031910, 50.526795]
    },
    SDZ: {
        id: "SDZ",
        srName: "Sędziszów",
        trainPosRange: 0.5,
        platformPosOverride: [20.058531, 50.568298]
    },
    R19_WP14: {
        id: "R19_WP14",
        srName: "Line R19",
        trainPosRange: 0.1,
        platformPosOverride: [19.936579, 50.545345]
    },
    RDZ_P31: {
        id: "RDZ_P31",
        srName: "Radzice PZS R31",
        trainPosRange: 0.5,
        platformPosOverride: [20.338202, 51.483653]
    },
    RDZ_R12: {
        id: "RDZ_R12",
        srName: "Radzice R12",
        trainPosRange: 0.5,
        platformPosOverride: [20.340260, 51.482987]
    },
    ZEL_R6: {
        id: "ZEL_R6",
        srName: "Żelisławice R.6",
        trainPosRange: 0.5,
        platformPosOverride: [19.859630, 50.804040]
    },
    ZYR: {
        id: "ZYR",
        srName: "Żyrardów",
        trainPosRange: 0.5,
        platformPosOverride: [20.448360, 52.052271]
    },
    PRZ: {
        id: "PRZ",
        srName: "Przemiarki",
        trainPosRange: 0.5,
        platformPosOverride: [19.340207, 50.385943]
    },
    DG_T_R5: {
        id: "DG_T_R5",
        srName: "Dąbrowa Górnicza Towarowa DTA R5",
        trainPosRange: 0.5,
        platformPosOverride: [19.377485, 50.329225]
    },
    KOZI: {
        id: "KOZI",
        srName: "Kozioł",
        trainPosRange: 0.5,
        platformPosOverride: [19.382807, 50.308508]
    },
    KOZI_R12: {
        id: "KOZI_R12",
        srName: "Kozioł R12",
        trainPosRange: 0.5,
        platformPosOverride: [19.358590, 50.299019]
    },
    JU: {
        id: "JU",
        srName: "Juliusz",
        trainPosRange: 0.5,
        platformPosOverride: [19.225059, 50.272341],
        graphConfig: {
            pre: ["KZ", "SG_PO"],
            post: ["DOR", "DG_WZ"],
            final: [],
        }
    },
    SZA: {
        id: "SZA",
        srName: "Szabelnia",
        trainPosRange: 0.5,
        platformPosOverride: [19.110300, 50.259170]
    },
    SOM: {
        id: "SOM",
        srName: "Sosnowiec Maczki",
        trainPosRange: 0.5,
        platformPosOverride: [19.270203, 50.261328]
    },
    DGHK: {
        id: "DGHK",
        srName: "Dąbrowa Górnicza Huta Katowice",
        trainPosRange: 0.5,
        platformPosOverride: [19.259529, 50.335830],
        graphConfig: {
            pre: ["DG_ST"],
            post: ["SOM"],
            final: [],
        }
    },
    BT: {
        id: "BT",
        srName: "Kraków Batowice",
        trainPosRange: 0.5,
        platformPosOverride: [19.995512, 50.107583]
    },
    KPM: {
        id: "KPM",
        srName: "Kraków Przedmieście",
        trainPosRange: 0.5,
        platformPosOverride: [19.950491, 50.085835]
    },
    MI: {
        id: "MI",
        srName: "Miechów",
        trainPosRange: 0.5,
        platformPosOverride: [20.010915, 50.354104]
    },
    ND: {
        id: "ND",
        srName: "Niedźwiedź",
        trainPosRange: 0.5,
        platformPosOverride: [20.080913, 50.204321]
    },
    RC: {
        id: "RC",
        srName: "Raciborowice",
        trainPosRange: 0.5,
        platformPosOverride: [20.028362, 50.110835]
    },
    SM: {
        id: "SM",
        srName: "Słomniki",
        trainPosRange: 0.5,
        platformPosOverride: [20.064118, 50.248487]
    },
    ZS: {
        id: "ZS",
        srName: "Zastów",
        trainPosRange: 0.5,
        platformPosOverride: [20.068938, 50.123658]
    },
    STR: {
        id: "STR",
        srName: "Starzyny",
        trainPosRange: 0.5,
        platformPosOverride: [19.808223, 50.699062]
    },
    ZR: {
        id: "ZR",
        srName: "Żyrardów",
        trainPosRange: 0.5,
        platformPosOverride: [20.449687, 52.052713]
    },
    SK: {
        id: "SK",
        srName: "Skierniewice",
        trainPosRange: 0.5,
        platformPosOverride: [20.151522, 51.967741]
    },
    PL: {
        id: "PL",
        srName: "Płyćwia",
        trainPosRange: 0.5,
        platformPosOverride: [20.002163, 51.916689]
    },
    RG: {
        id: "RG",
        srName: "Rogów",
        trainPosRange: 0.5,
        platformPosOverride: [19.886288, 51.818258]
    },
    KOL: {
        id: "KOL",
        srName: "Koluszki",
        trainPosRange: 0.5,
        platformPosOverride: [19.818625, 51.743419]
    },
    ZP: {
        id: "ZP",
        srName: "Żakowice Południowe",
        trainPosRange: 0.5,
        platformPosOverride: [19.789771, 51.729455]
    },
    G: {
        id: "G",
        srName: "Gałkówek",
        trainPosRange: 0.5,
        platformPosOverride: [19.731778, 51.729788]
    },
    LW: {
        id: "LW",
        srName: "Łódź Widzew",
        trainPosRange: 0.5,
        platformPosOverride: [19.543928, 51.763177]
    }
}

export const postToInternalIds =  _keyBy(Object.values(postConfig).map((pc) => ({
    id: pc.id,
    srId: encodeURIComponent(pc.srName)
})), 'srId');
