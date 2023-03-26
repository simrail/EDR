export const BASE_SIMRAIL_API = "https://panel.simrail.eu:8084/";
export const BASE_AWS_API = "https://api1.aws.simrail.eu:8082/api/"
export const BASE_SIMKOL_API = "https://webhost.simkol.pl";

export const srHeaders = {
    "User-Agent": "Simrail.app EDR vDEV",
    "xx-client": "Simrail.app EDR",
    "xx-maintainer": "CrypterEmerald",
    "xx-contact": "tally.github@gmail.com",
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
    "SG_R52": "Sosnowiec_Główny R52", // TODO: Fake for staging
    "DG": "Dąbrowa Górnicza",
    "T1_BZ": "Będzin",
    "BZ": "Będzin",
    "LZ_LC": "Łazy Łc",
    "ZA": "Zawiercie",
    "OP_PO": "Opoczno Południe",
    "DG_WZ": "Dąbrowa Górnicza Wschodnia",
    "DG_ZA": "",
    "SG_PO": "Sosnowiec Południowy",
    "IDZ": "Idzikowice",
    "GRO_MAZ": "Grodzisk Mazowiecki",
    "DOR": "Dorota",
    "KOR": "Korytów",
    "SZE": "Szeligi"
}

export const newInternalIdToSrId: {[k: string]: string} = {
    "T1_BZ": "124",
    "BZ": "124",
    "LZ_LC": "2375",
    "SG_R52": "3991",
    "SG": "3993",
    "DG": "719",
    "GW": "1193",
    "PS": "3436",
    "KN": "1772",
    "WP": "4987",
    "OZ": "2969",
    "PI": "3200",
    "OP_PO": "2993",
    "ZA": "5262",
    "DG_WZ": "733",
    "SP": "4010",
    "IDZ": "1349",
    "KZ": "1655",
    "SG_PO": "4010",
    "GRO_MAZ": "1251",
    "DOR": "835",
    "KOR": "1852",
    "SZE": "4338"
}

export const POSTS: { [key: string]: string[] } = {
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
    "ZA": [newInternalIdToSrId["ZA"]],
    "OP": [newInternalIdToSrId["OP_PO"]],
    "DG_WZ": [newInternalIdToSrId["DG_WZ"]],
    "DGZ": [newInternalIdToSrId["DGZ"]],
    "SP": [newInternalIdToSrId["SP"]],
    "IDZ": [newInternalIdToSrId["IDZ"]],
    "SG_PO": [newInternalIdToSrId["SG_PO"]],
    "OP_PO": [newInternalIdToSrId["OP_PO"]],
    "GRO_MAZ": [newInternalIdToSrId["GRO_MAZ"]],
    "KOR": [newInternalIdToSrId["KOR"]],
    "DOR": [newInternalIdToSrId["DOR"]],
    "SZE": [newInternalIdToSrId["SZE"]]
};
