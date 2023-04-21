
import LAYOVER from "./images/icons/png/layover.png";
import TRACK from './images/icons/png/track.png';
import RIGHT_ARROW from './images/icons/png/right-chevron.png';
import BELL from './images/icons/png/bell.png';
import CHECK from './images/icons/png/check.png';
import QUALITY_TRACK from './images/icons/png/quality.png';
import OVER_GAUGE from './images/icons/png/overgauge.png';
import OVER_WEIGHT from './images/icons/png/overweight.png';
import HIGH_RISK from './images/icons/png/highrisk.png';
import DANGEROUS from './images/icons/png/dangerous.png';
import SPECIAL_CARGO from './images/icons/png/specialcargo.png';
import LAYOVER_WEBP from "./images/icons/png/layover.png";
import TRACK_WEBP from './images/icons/png/track.png';
import RIGHT_ARROW_WEBP from './images/icons/png/right-chevron.png';
import BELL_WEBP from './images/icons/png/bell.png';
import CHECK_WEBP from './images/icons/png/check.png';
import QUALITY_TRACK_WEBP from './images/icons/webp/quality.webp';
import OVER_GAUGE_WEBP from './images/icons/webp/overgauge.webp';
import OVER_WEIGHT_WEBP from './images/icons/webp/overweight.webp';
import HIGH_RISK_WEBP from './images/icons/webp/highrisk.webp';
import DANGEROUS_WEBP from './images/icons/webp/dangerous.webp';
import SPECIAL_CARGO_WEBP from './images/icons/webp/specialcargo.webp';

import BN from "./images/posts/jpg/Bedzin.jpg";
import DG from "./images/posts/jpg/Dabrowa_Gornicza.jpg";
import DGW from "./images/posts/jpg/Dabrowa_Gornicza_Wschodnia.jpg";
import DOR from "./images/posts/jpg/Dorota.jpg";
import GM from "./images/posts/jpg/Grodzisk_Mazowiecki.jpg";
import GW from "./images/posts/jpg/Gora_Wlodowska.jpg";
import IDZ from "./images/posts/jpg/Idzikowice.jpg";
import KN from "./images/posts/jpg/Knapowka.jpg";
import KOR from './images/posts/jpg/Korytow.jpg';
import KZ from "./images/posts/jpg/Katowice_Zawodzie.jpg";
import LC from "./images/posts/jpg/Lazy_Lc.jpg";
import OL from "./images/posts/jpg/Olszamowice.jpg";
import OP_PO from "./images/posts/jpg/Opoczno_Poludnie.jpg";
import PI from "./images/posts/jpg/Pilichowice.jpg";
import PS from "./images/posts/jpg/Psary.jpg";
import SG from "./images/posts/jpg/Sosnowiec_Glowny.jpg";
import SG_PO from "./images/posts/jpg/Sosnowiec_Poludniowy.jpg";
import WP from "./images/posts/jpg/Wloszczowa_Polnoc.jpg";
import ZA from "./images/posts/jpg/Zawiercie.jpg";
import SE from "./images/posts/jpg/Szeligi.jpg";
import JU from "./images/posts/jpg/Juliusz.jpg";

import BN_WEBP from "./images/posts/webp/Bedzin.webp";
import DG_WEBP from "./images/posts/webp/Dabrowa_Gornicza.webp";
import DGW_WEBP from "./images/posts/webp/Dabrowa_Gornicza_Wschodnia.webp";
import DOR_WEBP from "./images/posts/webp/Dorota.webp";
import GM_WEBP from "./images/posts/webp/Grodzisk_Mazowiecki.webp";
import GW_WEBP from "./images/posts/webp/Gora_Wlodowska.webp";
import IDZ_WEBP from "./images/posts/webp/Idzikowice.webp";
import KOR_WEBP from './images/posts/webp/Korytow.webp';
import KN_WEBP from "./images/posts/webp/Knapowka.webp";
import KZ_WEBP from "./images/posts/webp/Katowice_Zawodzie.webp";
import LC_WEBP from "./images/posts/webp/Lazy_Lc.webp";
import OL_WEBP from "./images/posts/webp/Olszamowice.webp";
import OP_PO_WEBP from "./images/posts/webp/Opoczno_Poludnie.webp";
import PI_WEBP from "./images/posts/webp/Pilichowice.webp";
import PS_WEBP from "./images/posts/webp/Psary.webp";
import SG_WEBP from "./images/posts/webp/Sosnowiec_Glowny.webp";
import SG_PO_WEBP from "./images/posts/webp/Sosnowiec_Poludniowy.webp";
import WP_WEBP from "./images/posts/webp/Wloszczowa_Polnoc.webp";
import ZA_WEBP from "./images/posts/webp/Zawiercie.webp";
import SE_WEBP from "./images/posts/webp/Szeligi.webp";
import JU_WEBP from "./images/posts/webp/Juliusz.webp";

import { GB, FR, PL, CZ, ES, DE, UA, IT, CN, PT, HU, NL} from 'country-flag-icons/string/3x2'

export const LOGGING = false;

export const countriesFlags: {[k: string]: string} = {
    CN,
    CZ,
    DE,
    EN: GB,
    ES,
    FR,
    HU,
    IT,
    NL,
    PL,
    PT,
    UA,
}


// Polish characters are not allowed as map keys
// TODO: Is this still really usefull ? If yes, calc automatically
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

export const optimizedPostsImagesMap: {[k: string]: string} = {
    B: BN,
    DG,
    DRA: DOR,
    DW: DGW,
    GR: GM,
    GW,
    ID: IDZ,
    JU,
    KN,
    KR: KOR,
    KZ,
    ŁC: LC,
    OL,
    OP: OP_PO,
    PI,
    PS,
    SE,
    SG,
    SPŁ1: SG_PO,
    WP,
    ZW: ZA,
}

export const optimizedPostsWebpImagesMap: {[k: string]: string} = {
    B: BN_WEBP,
    DG: DG_WEBP,
    DRA: DOR_WEBP,
    DW: DGW_WEBP,
    GR: GM_WEBP,
    GW: GW_WEBP,
    ID: IDZ_WEBP,
    JU: JU_WEBP,
    KN: KN_WEBP,
    KR: KOR_WEBP,
    KZ: KZ_WEBP,
    ŁC: LC_WEBP,
    OL: OL_WEBP,
    OP: OP_PO_WEBP,
    PI: PI_WEBP,
    PS: PS_WEBP,
    SE: SE_WEBP,
    SG: SG_WEBP,
    SPŁ1: SG_PO_WEBP,
    WP: WP_WEBP,
    ZW: ZA_WEBP,
}

export const edrImagesMap : {[k: string]: string} = {
    LAYOVER,
    TRACK,
    RIGHT_ARROW,
    BELL,
    CHECK,
    QUALITY_TRACK,
    OVER_GAUGE,
    OVER_WEIGHT,
    HIGH_RISK,
    DANGEROUS,
    SPECIAL_CARGO
}

export const edrWebpImagesMap : {[k: string]: string} = {
    LAYOVER: LAYOVER_WEBP,
    TRACK: TRACK_WEBP,
    RIGHT_ARROW: RIGHT_ARROW_WEBP,
    BELL: BELL_WEBP,
    CHECK: CHECK_WEBP,
    QUALITY_TRACK: QUALITY_TRACK_WEBP,
    OVER_GAUGE: OVER_GAUGE_WEBP,
    OVER_WEIGHT: OVER_WEIGHT_WEBP,
    HIGH_RISK: HIGH_RISK_WEBP,
    DANGEROUS: DANGEROUS_WEBP,
    SPECIAL_CARGO: SPECIAL_CARGO_WEBP
}

export const searchSeparator = ','

