import { StationId } from "./enum/stationId.js";

export const BASE_SIMRAIL_API = "https://panel.simrail.eu:8084/";
export const BASE_AWS_API = "https://api.simrail.eu:8082/api/"
export const BASE_SIMKOL_API = "https://webhost.simkol.pl/";
export const BASE_SELF_API = `http://localhost:${process.env.LISTEN_PORT}/`;
export const BASE_OSRM_API = "http://localhost:5000/";

export const srHeaders = {
    "User-Agent": "Simrail.app EDR vDEV",
    "xx-client": "Simrail.app EDR",
    "xx-maintainer": "CrypterEmerald",
    "xx-contact": "tally.github@gmail.com",
};

export const newInternalIdToSrId: {[k: string]: number} = {
    "B": StationId.bedzin,
    "BK": StationId.bukowno,
    "BR": StationId.biala_rawska,
    "BT": StationId.krakow_batowice,
    "BZ": StationId.bedzin,
    "DG_WZ": StationId.dabrowa_gornicza_wschodnia,
    "DG_ZA": StationId.dabrowa_gornicza_zabkowice,
    "DG": StationId.dabrowa_gornicza,
    "DGHK": StationId.dabrowa_gornicza_huta_katowice,
    "DOR": StationId.dorota,
    "GRO_MAZ": StationId.grodzisk_mazowiecki,
    "GW": StationId.gora_wlodowska,
    "IDZ": StationId.idzikowice,
    "JU": StationId.juliusz,
    "KN": StationId.knapowka,
    "KO": StationId.katowice,
    "KOR": StationId.korytow,
    "KOZ": StationId.kozlow,
    "KPM": StationId.krakow_przedmiescie,
    "KZ": StationId.katowice_zawodzie,
    "LZ_LA": StationId.lazy_la,
    "LZ_LB": StationId.lazy,
    "LZ_LC": StationId.lazy_lc,
    "MI": StationId.miechow,
    "ND": StationId.niedzwiedz,
    "OP_PO": StationId.opoczno_poludnie,
    "OZ": StationId.olszamowice,
    "PI": StationId.pilichowice,
    "PRSZ": StationId.pruszkow,
    "PS": StationId.psary,
    "RC": StationId.raciborowice,
    "SG_KAZ": StationId.sosnowiec_kazimierz,
    "SG_PO": StationId.sosnowiec_poludniowy,
    "SG_R52": StationId.sosnowiec_gl__pzs_r52,
    "SG": StationId.sosnowiec_glowny,
    "SLK": StationId.slawkow,
    "SMN": StationId.slomniki,
    "ST": StationId.strzalki,
    "STR": StationId.starzyny,
    "SZE": StationId.szeligi,
    "TN": StationId.tunel,
    "WP": StationId.wloszczowa_polnoc,
    "WW": StationId.warszawa_wlochy,
    "ZA": StationId.zawiercie,
    "ZS": StationId.zastow,
}

export const POSTS: { [key: string]: number[] } = {
    "B": [newInternalIdToSrId["B"]],
    "BK": [newInternalIdToSrId["BK"]],
    "BR": [newInternalIdToSrId["BR"]],
    "BT": [newInternalIdToSrId["BT"]],
    "BZ": [newInternalIdToSrId["BZ"]],
    "DG_WZ": [newInternalIdToSrId["DG_WZ"]],
    "DG_ZA": [newInternalIdToSrId["DG_ZA"]],
    "DG": [newInternalIdToSrId["DG"]],
    "DGHK": [newInternalIdToSrId["DGHK"]],
    "DGZ": [newInternalIdToSrId["DGZ"]],
    "DOR": [newInternalIdToSrId["DOR"]],
    "GRO_MAZ": [newInternalIdToSrId["GRO_MAZ"]],
    "GW": [newInternalIdToSrId["GW"]],
    "IDZ": [newInternalIdToSrId["IDZ"]],
    "JU": [newInternalIdToSrId["JU"]],
    "KN": [newInternalIdToSrId["KN"]],
    "KO": [newInternalIdToSrId["KO"]],
    "KOR": [newInternalIdToSrId["KOR"]],
    "KOZ": [newInternalIdToSrId["KOZ"]],
    "KPM": [newInternalIdToSrId["KPM"]],
    "KZ": [newInternalIdToSrId["KZ"]],
    "LZ_LA": [newInternalIdToSrId["LZ_LA"]],
    "LZ_LB": [newInternalIdToSrId["LZ_LB"]],
    "LZ_LC": [newInternalIdToSrId["LZ_LC"]],
    "MI": [newInternalIdToSrId["MI"]],
    "ND": [newInternalIdToSrId["ND"]],
    "OP_PO": [newInternalIdToSrId["OP_PO"]],
    "OP": [newInternalIdToSrId["OP_PO"]],
    "OZ": [newInternalIdToSrId["OZ"]],
    "PI": [newInternalIdToSrId["PI"]],
    "PRSZ": [newInternalIdToSrId["PRSZ"]],
    "PS": [newInternalIdToSrId["PS"]],
    "RC": [newInternalIdToSrId["RC"]],
    "SG_KAZ": [newInternalIdToSrId["SG_KAZ"]],
    "SG_PO": [newInternalIdToSrId["SG_PO"]],
    "SG": [newInternalIdToSrId["SG"], newInternalIdToSrId["SG_R52"]],
    "SLK": [newInternalIdToSrId["SLK"]],
    "SMN": [newInternalIdToSrId["SMN"]],
    "ST": [newInternalIdToSrId["ST"]],
    "STR": [newInternalIdToSrId["STR"]],
    "SZE": [newInternalIdToSrId["SZE"]],
    "TN": [newInternalIdToSrId["TN"]],
    "WP": [newInternalIdToSrId["WP"]],
    "WW": [newInternalIdToSrId["WW"]],
    "ZA": [newInternalIdToSrId["ZA"]],
    "ZS": [newInternalIdToSrId["ZS"]],
};

export const stationPositions: {[x: number]: number[]} = {
    [StationId.bedzin]:                         [19.141858, 50.308533],
    [StationId.biala_rawska]:                   [20.439459, 51.794781],
    [StationId.bukowno]:                        [19.458295, 50.263935],
    [StationId.charsznica]:                     [19.945038, 50.400941],
    [StationId.chrzastowice]:                   [19.684937, 50.342805],
    [StationId.czarnca_]:                       [19.944717, 50.823259],
    [StationId.dabrowa_gornicza_huta_katowice]: [19.259399, 50.336080],
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
    [StationId.kozlow]:                         [20.012298, 50.474814],
    [StationId.krakow_batowice]:                [19.995512, 50.107583],
    [StationId.krakow_przedmiescie]:            [19.950491, 50.085835],
    [StationId.lazy_la]:                        [19.420255, 50.453892],
    [StationId.lazy_lc]:                        [19.362862, 50.416436],
    [StationId.lazy]:                           [19.391998, 50.430172],
    [StationId.miechow]:                        [20.010915, 50.354104],
    [StationId.myszkow]:                        [19.327265, 50.564696],
    [StationId.niedzwiedz]:                     [20.080913, 50.204321],
    [StationId.olkusz]:                         [19.575538, 50.273849],
    [StationId.olszamowice]:                    [20.064510, 51.095555],
    [StationId.opoczno_poludnie]:               [20.232192, 51.358965],
    [StationId.pilichowice]:                    [20.121068, 51.254694],
    [StationId.pruszkow]:                       [20.798650, 52.168203],
    [StationId.przemiarki]:                     [19.340207, 50.385943],
    [StationId.psary]:                          [19.820087, 50.735068],
    [StationId.raciborowice]:                   [20.028362, 50.110835],
    [StationId.radzice]:                        [20.395877, 51.467032],
    [StationId.sedziszow]:                      [20.058531, 50.568298],
    [StationId.slawkow]:                        [19.373859, 50.295393],
    [StationId.slomniki]:                       [20.064118, 50.248487],
    [StationId.sosnowiec_dandowka]:             [19.177154, 50.266830],
    [StationId.sosnowiec_gl__pzs_r52]:          [19.114761, 50.272224],
    [StationId.sosnowiec_glowny]:               [19.127083, 50.279388],
    [StationId.sosnowiec_kazimierz]:            [19.231430, 50.288483],
    [StationId.sosnowiec_poludniowy]:           [19.125598, 50.269550],
    [StationId.starzyny]:                       [19.808223, 50.699062],
    [StationId.strzalki]:                       [20.406687, 51.642870],
    [StationId.szeligi]:                        [20.457199, 51.942969],
    [StationId.tunel]:                          [19.991247, 50.433672],
    [StationId.warszawa_centralna]:             [20.995669, 52.228060],
    [StationId.warszawa_wlochy]:                [20.913925, 52.206410],
    [StationId.warszawa_zachodnia]:             [20.963415, 52.219911],
    [StationId.wloszczowa_polnoc]:              [19.945774, 50.856198],
    [StationId.wolbrom]:                        [19.762643, 50.377749],
    [StationId.zastow]:                         [20.068938, 50.123658],
    [StationId.zawiercie]:                      [19.423131, 50.481001],
    [StationId.zyrardow]:                       [20.448360, 52.052271],
}
