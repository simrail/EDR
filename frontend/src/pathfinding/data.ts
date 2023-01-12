import {postConfig} from "../config";
import {dbgTree} from "./api";

export interface Node {
    id: string;
    platformPosOverride?: [number, number]
    left?: string,
    right?: string,
    branchA?: string
}

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
    right: "KSP"
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
    right: "SG"
}

// Sosnowiec glowny
const SG = {
    ...postConfig.SG,
    left: "SG_R52",
    right: "T1_BZ",
    branchA: "SG_PO"
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
    right: "DG_SI"
}

// Dabrowa Gornica Sikorka
const DG_SI = {
    ...postConfig.DG_SI,
    left: "DG_ZA",
    right: "CZ"
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
    right: "LZ"
};

// Lazy
const LZ = {
    ...postConfig.LZ,
    left: "LZ_LC",
    right: "ZA"
}

// Zawiercie
const ZA = {
    ...postConfig.ZA,
    left: "LZ",
    right: "ZA_BO_PO"
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
    right: "KN" // TODO: Branch to Starzyny
}

// Knapówka
const KN = {
    ...postConfig.KN,
    left: "PS",
    right: "WP"
}

// Włoszczowa Północ
const WP = {
    ...postConfig.WP,
    left: "KN",
    right: "OZ"
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
    left: "PI"
}

// Line ???
const MY_MR = {
    ...postConfig.MY_MR,
    left: "ZA_BO_PO"
}

// Line 660
const SG_PO = {
    ...postConfig.SG_PO,
    left: "SG",
    right: "SG_DK"
};

const SG_DK = {
    ...postConfig.SG_DK,
    left: "SG_PO",
    right: "SG_DK"
};


// The stackmap is used as a drop in replacement because JS has no pointers (well quircky ones)
// So its better to use a hashmap since its still O(1) access
export const pathFind_stackMap: {[k: string]: Node} = {
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
    DG_SI: DG_SI,
    CZ: CZ,
    WI: WI,
    LZ_LC: LZ_LC,
    LZ: LZ,
    ZA: ZA,
    ZA_BO_PO: ZA_BO_PO,
    GW: GW,
    PS: PS,
    KN: KN,
    WP: WP,
    OZ: OZ,
    PI: PI,
    OP_PO: OP_PO,

    // Line ??
    MY_MR: MY_MR,
    SG_DK: SG_DK,

    // Line 660
    SG_PO: SG_PO,
}


