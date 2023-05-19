import {postConfig} from "../config/stations";
import { ExtendedStationConfig } from "../EDR/functions/trainDetails";

/**
 * Pathfinding data.
 *
 * Going left to right means going from Kato to Warsaw on line 1
 *
 * Branching is when the line is branching to anorther line station
 *
 * The main algorighm for the pathfinding is using an N tree traversal with an anti circular recursion guard
 */
// TODO: Some stations are skipped or out of order
// katowice zawodice
const KZ = {
    ...postConfig.KZ,
    left: "KO",
    right: "KSP",
    branchA: "SZA"
}

// kato central
const KO = {
    ...postConfig.KO,
    right: "KZ"
};

// Kato small station
const KSP = {
    ...postConfig.KSP,
    left: "KZ",
    right: "SG_R52"
};

const SG_R52 = {
    ...postConfig.SG_R52,
    left: "KSP",
    right: "SG",
    branchA: "SG_PO"
}

// Sosnowiec glowny
const SG = {
    ...postConfig.SG,
    left: "SG_R52",
    right: "T1_BZ",
};

// Bedzin
const T1_BZ = {
    ...postConfig.T1_BZ,
    left: "SG",
    right: "BZ_MI"
};

// Bedzin miasto
const BZ_MI = {
    ...postConfig.BZ_MI,
    left: "T1_BZ",
    right: "BZ_KS"
}

// Bedzin ksawera
const BZ_KS = {
    ...postConfig.BZ_KS,
    left: "BZ_MI",
    right: "DG"
}

// Dabrowa
const DG = {
    ...postConfig.DG,
    left: "BZ_MI",
    right: "DG_GO"
}

// Dabrowa Golong
const DG_GO = {
    ...postConfig.DG_GO,
    left: "DG",
    right: "DG_PO"
}


// Dabrowa Pogoria
const DG_PO = {
    ...postConfig.DG_PO,
    left: "DG_GO",
    right: "DG_ZA"
}


// Dabrowa Gornica Zabowice
const DG_ZA = {
    ...postConfig.DG_ZA,
    left: "DG_PO",
    right: "DG_DZA"
}

const DG_DZA = {
    ...postConfig.DG_DZA,
    left: "DG_ZA",
    right: "DG_SI",
    branchA: "DG_DZA_R47"
}

const DG_DZA_R47 = {
    ...postConfig.DG_DZA_R47,
    left: "DG_ZA",
    right: "DG_SI"
}

// Dabrowa Gornica Sikorka
const DG_SI = {
    ...postConfig.DG_SI,
    left: "DG_DZA",
    right: "CZ",
    branchA: "L660_L1WP"
}

// Chruszczobród
const CZ = {
    ...postConfig.CZ,
    left: "DG_SI",
    right: "WI"
}

// Wiesiółka
const WI = {
    ...postConfig.WI,
    left: "CZ",
    right: "LZ_LC"
};

// Łazy Łc
const LZ_LC = {
    ...postConfig.LZ_LC,
    left: "WI",
    right: "LZ_LB",
    branchA: "PRZ"
};

// Lazy
const LZ_LB = {
    ...postConfig.LZ,
    left: "LZ_LC",
    right: "LZ_LA"
}

// Lazy LA
const LZ_LA = {
    ...postConfig.LZ_LA,
    left: "LZ_LB",
    right: "ZA"
}

// Zawiercie
const ZA = {
    ...postConfig.ZA,
    left: "LZ_LA",
    right: "ZA_BO_PO",
}

// Zawiercie Borowe Pole
const ZA_BO_PO = {
    ...postConfig.ZA_BO_PO,
    left: "ZA",
    right: "GW",
    branchA: "MY_MR"
}

// Gora
const GW  = {
    ...postConfig.GW,
    left: "ZA_BO_PO",
    right: "PS"
}

// Psary
const PS = {
    ...postConfig.PS,
    left: "GW",
    right: "KN",
    branchA: "STZ"
}

// Knapówka
const KN = {
    ...postConfig.KN,
    left: "PS",
    right: "WP",
    branchA: "CZ_R19"
}

// Włoszczowa Północ
const WP = {
    ...postConfig.WP,
    left: "KN",
    right: "OZ",
    branchA: "CZ_R19", // TODO: ?? Should be only psary
    branchB: "ZEL_R6"
}

// Olszamowice
const OZ = {
    ...postConfig.OZ,
    left: "WP",
    right: "PI"
};

// Pilichowice
const PI = {
    ...postConfig.PI,
    left: "OZ",
    right: "OP_PO"
};

// Opoczno Poludnie
const OP_PO = {
    ...postConfig.OP_PO,
    left: "PI",
    right: "IDZ"
}

// Idzikowice
const IDZ = {
    ...postConfig.IDZ,
    left: "OP_PO",
    right: "ST",
    branchA: "RDZ_R12",
    branchB: "RDZ_P31"
}

// Strzałki
const ST = {
    ...postConfig.ST,
    left: "IDZ",
    right: "BR"
}

// Szeligi
const SZE = {
    ...postConfig.SZE,
    left: "BR",
    right: "KOR"
}

const KOR = {
    ...postConfig.KOR,
    left: "SZE",
    right: "JKT"
}

// Jaktorów
const JKT = {
    ...postConfig.JKT,
    left: "SZE",
    right: "GRO_MAZ"
}

// Grodzisk Mazowiecki
const GRO_MAZ = {
    ...postConfig.GRO_MAZ,
    left: "JKT",
    right: "MIL"
}

// Milanówek
const MIL = {
    ...postConfig.MIL,
    left: "GRO_MAZ",
    right: "BRW"
}

// Brwinów
const BRW = {
    ...postConfig.BRW,
    left: "MIL",
    right: "PARZ"
}

// Parzniew
const PARZ = {
    ...postConfig.PARZ,
    left: "BRW",
    right: "PRSZ"
}

// Pruszków
const PRSZ = {
    ...postConfig.PRSZ,
    left: "PARZ",
    right: "PIA"
}

// Piastów
const PIA = {
    ...postConfig.PIA,
    left: "PRSZ",
    right: "WUN"
}

// Warszawa Ursus-Niedźwiadek
const WUN = {
    ...postConfig.WUN,
    left: "PIA",
    right: "WW"
}

// Warszawa Włochy
const WW = {
    ...postConfig.WW,
    left: "WUN",
    right: "WZ"
}

const WZ = {
    ...postConfig.WZ,
    left: "WW",
    right: "WC"
}

// Warszawa Centralna
const WC = {
    ...postConfig.WC,
    left: "WZ"
}


// Line ???
const MY_MR = {
    ...postConfig.MY_MR,
    left: "MY",
    right: "ZA_BO_PO"
}

const MY = {
    ...postConfig.MY,
    left: "SZA",
    right: "MY_MR"
}

// Line 660
const SG_PO = {
    ...postConfig.SG_PO,
    left: "SG_R52",
    right: "SG_DK"
};

const SG_DK = {
    ...postConfig.SG_DK,
    left: "SG_PO",
    right: "SG_POR",
    branchA: "JU"
};

const JU = {
    ...postConfig.JU,
    left: "SG_DK",
    right: "DOR"
}

const SG_POR = {
    ...postConfig.SG_POR,
    left: "SG_DK",
    right: "SG_KAZ"
}

const SG_KAZ = {
    ...postConfig.SG_KAZ,
    left: "SG_POR",
    right: "DG_ST"
}

const DG_WZ = {
    ...postConfig.DG_WZ,
    left: "DOR",
    right: "SLK",
    branchA: "DG_ST",
    branchB: "KOZI_R12"
}

const DG_ST = {
    ...postConfig.DG_ST,
    left: "DG_WZ",
    right: "DG_ZA",
    branchA: "DOR"
}

const DOR = {
    ...postConfig.DOR,
    right: "DG_ST",
    left: "JU",
    branchA: "DG_WZ",
    branchB: "SM"
}

const SLK = {
    ...postConfig.SLK,
    left: "DG_WZ",
    right: "BP"
}

const BP = {
    ...postConfig.BP,
    left: "SLK",
    right: "BK"
}

const BK = {
    ...postConfig.BK,
    left: "BP",
    right: "OK"
}

const OK = {
    ...postConfig.OK,
    left: "BK",
    right: "JO"
}

const JO = {
    ...postConfig.JO,
    left: "OK",
    right: "CO"
}

const CO = {
    ...postConfig.CO,
    left: "JO",
    right: "WB"
}

const WB = {
    ...postConfig.WB,
    left: "CO",
    right: "JZ"
}

const JZ = {
    ...postConfig.JZ,
    left: "WB",
    right: "GJ"
}

const GJ = {
    ...postConfig.GJ,
    left: "JZ",
    right: "TN"
}

const TN = {
    ...postConfig.TN,
    left: "GJ",
    right: "CH"
}

const CH = {
    ...postConfig.CH,
    left: "TN",
    right: "KOZ"
}

const KOZ = {
    ...postConfig.KOZ,
    left: "CH",
    right: "KLI",
    branchA: "STZ"// TODO: Branch up to line 1
}

const KLI = {
    ...postConfig.KLI,
    left: "KOZ",
    right: "SDZ"
}

const SDZ = {
    ...postConfig.SDZ,
    left: "KLI"
}

const CZ_R19 = {
    ...postConfig.CZ_R19,
    branchA: "KN",
    right: "R19_WP14"
};

const R19_WP14 = {
    ...postConfig.R19_WP14,
    left: "CZ_R19",
    right: "KOZ"
}
const STZ = {
    ...postConfig.STZ,
    right: "PS",
    left: "KOZ"
}

const RDZ_P31 = {
    ...postConfig.RDZ_P31,
    branchA: "IDZ"
};

const RDZ_R12 = {
    ...postConfig.RDZ_R12,
    branchA: "IDZ"
}

const ZEL_R6 = {
    ...postConfig.ZEL_R6,
    branchA: "WP"
}

const ZYR = {
    ...postConfig.ZYR,
    branchA: "GRO_MAZ"
}

const PRZ = {
    ...postConfig.PRZ,
    left: "LZ_LC",
    right: "DG_T_R5"
}

const DG_T_R5 = {
    ...postConfig.DG_T_R5,
    left: "PRZ",
    right: "KOZI"
}

const KOZI = {
    ...postConfig.KOZ,
    left: "DG_T_R5",
    right: "KOZI_R12"
}

const KOZI_R12 = {
    ...postConfig.KOZ,
    left: "KOZI",
    right: "DG_WZ"
}

const BR = {
    ...postConfig.BR,
    left: "ST",
    right: "SZE"
}

const SZA = {
    ...postConfig.SZA,
    left: "MY",
    right: "KZ"
}

const SM = {
    ...postConfig.SM,
    right: "DOR"
}


// The stackmap is used as a drop in replacement because JS has no pointers (well quircky ones)
// So its better to use a hashmap since its still O(1) access
export const pathFind_stackMap: {[k: string]: ExtendedStationConfig} = {
    // Line 1 Kato -> Warso
    KZ: KZ,
    KO: KO,
    KSP: KSP,
    SG_R52: SG_R52,
    SG: SG,
    T1_BZ: T1_BZ,
    BZ_MI: BZ_MI,
    BZ_KS: BZ_KS,
    DG: DG,
    DG_GO: DG_GO,
    DG_PO: DG_PO,
    DG_ZA: DG_ZA,
    DG_DZA,
    DG_DZA_R47,
    DG_SI: DG_SI,
    CZ: CZ,
    WI: WI,
    LZ_LC: LZ_LC,
    LZ_LB,
    LZ_LA: LZ_LA,
    ZA: ZA,
    ZA_BO_PO: ZA_BO_PO,
    GW: GW,
    PS: PS,
    KN: KN,
    WP: WP,
    OZ: OZ,
    PI: PI,
    OP_PO: OP_PO,
    IDZ: IDZ,
    ST,
    BR,
    SZE,
    KOR,
    JKT,
    GRO_MAZ,
    MIL,
    BRW,
    PARZ,
    PRSZ,
    PIA,
    WUN,
    WW,
    WZ,
    WC,

    // Line ??
    MY_MR: MY_MR,
    SG_DK: SG_DK,

    // R19
    R19_WP14: R19_WP14,
    DG_ST: DG_ST, // TODO: Purposefull breakpoint to avoid wierd routes without weight
    DOR: DOR,


    CZ_R19: CZ_R19,
    STZ: STZ,
    MY: MY,

    // Line 660
    SG_PO: SG_PO,
    SG_POR: SG_POR,
    SG_KAZ,
    DG_WZ,
    SLK,
    BP,
    BK,
    OK,
    JO,
    WB,
    JZ,
    GJ,
    TN,
    KOZ,
    KLI,
    SDZ,
    CO,
    CH,

    RDZ_R12,
    RDZ_P31,
    ZEL_R6,

    ZYR,
    PRZ,
    DG_T_R5,
    KOZI,
    KOZI_R12,
    JU,
    SZA,
    SM,
}


