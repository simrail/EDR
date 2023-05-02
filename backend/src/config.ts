import { StationId } from "./enum/stationId.js";

export const BASE_SIMRAIL_API = "https://panel.simrail.eu:8084/";
export const BASE_AWS_API = "https://api1.aws.simrail.eu:8082/api/"
export const BASE_SIMKOL_API = "https://webhost.simkol.pl/";
export const BASE_SELF_API = "https://example.com/";

export const srHeaders = {
    "User-Agent": "Simrail.app EDR vDEV",
    "xx-client": "Simrail.app EDR",
    "xx-maintainer": "CrypterEmerald",
    "xx-contact": "tally.github@gmail.com",
};

export const newInternalIdToSrId: {[k: string]: number} = {
    "T1_BZ": 124,
    "BZ": 124,
    "LZ_LC": 2375,
    "LZ_LB": 2371,
    "LZ_LA": 2374,
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
    "DG_ZA": 734,
    "SP": 4010,
    "IDZ": 1349,
    "KZ": 1655,
    "SG_PO": 4010,
    "GRO_MAZ": 1251,
    "DOR": 835,
    "KOR": 1852,
    "SZE": 4338,
    "JU": 1545,
}

export const POSTS: { [key: string]: number[] } = {
    "GW": [newInternalIdToSrId["GW"]],
    "PS": [newInternalIdToSrId["PS"]],
    "KN": [newInternalIdToSrId["KN"]],
    "WP": [newInternalIdToSrId["WP"]],
    "OZ": [newInternalIdToSrId["OZ"]],
    "PI": [newInternalIdToSrId["PI"]],
    "KZ": [newInternalIdToSrId["KZ"]],
    "SG": [newInternalIdToSrId["SG"], newInternalIdToSrId["SG_R52"]],
    "DG": [newInternalIdToSrId["DG"]],
    "BZ": [newInternalIdToSrId["BZ"]],
    "T1_BZ": [newInternalIdToSrId["BZ"]],
    "LZ_LC": [newInternalIdToSrId["LZ_LC"]],
    "LZ_LB": [newInternalIdToSrId["LZ_LB"]],
    "LZ_LA": [newInternalIdToSrId["LZ_LA"]],
    "ZA": [newInternalIdToSrId["ZA"]],
    "OP": [newInternalIdToSrId["OP_PO"]],
    "DG_WZ": [newInternalIdToSrId["DG_WZ"]],
    "DG_ZA": [newInternalIdToSrId["DG_ZA"]],
    "DGZ": [newInternalIdToSrId["DGZ"]],
    "SP": [newInternalIdToSrId["SP"]],
    "IDZ": [newInternalIdToSrId["IDZ"]],
    "SG_PO": [newInternalIdToSrId["SG_PO"]],
    "OP_PO": [newInternalIdToSrId["OP_PO"]],
    "GRO_MAZ": [newInternalIdToSrId["GRO_MAZ"]],
    "KOR": [newInternalIdToSrId["KOR"]],
    "DOR": [newInternalIdToSrId["DOR"]],
    "SZE": [newInternalIdToSrId["SZE"]],
    "JU": [newInternalIdToSrId["JU"]]
};

export const stationPositions: {[x: number]: number[]} = {
    [StationId.bedzin]:                         [19.141858, 50.308533],
    [StationId.bukowno]:                        [19.449322, 50.268088],
    [StationId.charsznica]:                     [19.945038, 50.400941],
    [StationId.chrzastowice]:                   [19.684937, 50.342805],
    [StationId.czarnca_r19]:                    [19.944717, 50.823259],
    [StationId.dabrowa_gornicza_strzemieszyce]: [19.268989, 50.311620],
    [StationId.dabrowa_gornicza_wschodnia]:     [19.306884, 50.303335],
    [StationId.dabrowa_gornicza_zabkowice_dza]: [19.272576, 50.375841],
    [StationId.dabrowa_gornicza_zabkowice]:     [19.264612, 50.366385],
    [StationId.dabrowa_gornicza]:               [19.184696, 50.330386],
    [StationId.dorota]:                         [19.282166, 50.285434],
    [StationId.gora_wlodowska]:                 [19.470318, 50.584134],
    [StationId.grodzisk_mazowiecki]:            [20.623149, 52.110193],
    [StationId.idzikowice]:                     [20.316125, 51.449722],
    [StationId.jaroszowiec_olkuski]:            [19.621830, 50.346223],
    [StationId.juliusz]:                        [19.225059, 50.272341],
    [StationId.katowice_zawodzie]:              [19.057551, 50.257280],
    [StationId.katowice]:                       [19.017109, 50.257589],
    [StationId.knapowka]:                       [19.904915, 50.800141],
    [StationId.korytow]:                        [20.495777, 52.022659],
    [StationId.koziol]:                         [19.382807, 50.308508],
    [StationId.kozlow]:                         [20.013627, 50.473377],
    [StationId.lazy_la]:                        [19.420255, 50.453892],
    [StationId.lazy_lc]:                        [19.362862, 50.416436],
    [StationId.lazy]:                           [19.386613, 50.428400],
    [StationId.myszkow]:                        [19.327265, 50.564696],
    [StationId.olkusz]:                         [19.575538, 50.273849],
    [StationId.olszamowice]:                    [20.064510, 51.095555],
    [StationId.opoczno_poludnie]:               [20.232192, 51.358965],
    [StationId.pilichowice]:                    [20.121068, 51.254694],
    [StationId.pruszkow]:                       [20.797801, 52.168125],
    [StationId.przemiarki]:                     [19.340207, 50.385943],
    [StationId.psary]:                          [19.820087, 50.735068],
    [StationId.radzice]:                        [20.395877, 51.467032],
    [StationId.sedziszow]:                      [20.058531, 50.568298],
    [StationId.slawkow]:                        [19.363855, 50.296788],
    [StationId.sosnowiec_dandowka]:             [19.177154, 50.266830],
    [StationId.sosnowiec_gl__pzs_r52]:          [19.114761, 50.272224],
    [StationId.sosnowiec_glowny]:               [19.127083, 50.279388],
    [StationId.sosnowiec_kazimierz]:            [19.226053, 50.277019],
    [StationId.sosnowiec_poludniowy]:           [19.125598, 50.269550],
    [StationId.starzyny]:                       [19.813349, 50.694149],
    [StationId.strzalki]:                       [20.406687, 51.642870],
    [StationId.szeligi]:                        [20.457199, 51.942969],
    [StationId.tunel]:                          [19.992372, 50.433771],
    [StationId.warszawa_centralna]:             [20.995669, 52.228060],
    [StationId.warszawa_wlochy]:                [20.913925, 52.206410],
    [StationId.warszawa_zachodnia]:             [20.963415, 52.219911],
    [StationId.wloszczowa_polnoc]:              [19.945774, 50.856198],
    [StationId.wolbrom]:                        [19.762643, 50.377749],
    [StationId.zawiercie]:                      [19.423131, 50.481001],
    [StationId.zyrardow]:                       [20.448360, 52.052271],
}
