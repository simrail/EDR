
import LAYOVER from "./images/icons/png/layover.png";
import TRACK from './images/icons/png/track.png';
import RIGHT_ARROW from './images/icons/png/right-chevron.png';
import BELL from './images/icons/png/bell.png';
import CHECK from './images/icons/png/check.png';
import LAYOVER_WEBP from "./images/icons/png/layover.png";
import TRACK_WEBP from './images/icons/png/track.png';
import RIGHT_ARROW_WEBP from './images/icons/png/right-chevron.png';
import BELL_WEBP from './images/icons/png/bell.png';
import CHECK_WEBP from './images/icons/png/check.png';

import GW from "./images/posts/jpg/gw.jpg";
import PS from "./images/posts/jpg/ps.jpg";
import KN from "./images/posts/jpg/kn.jpg";
import WP from "./images/posts/jpg/wp.jpg";
import OL from "./images/posts/jpg/ol.jpg";
import PI from "./images/posts/jpg/pi.jpg";
import KZ from "./images/posts/jpg/kz.jpg";
import SG from "./images/posts/jpg/sg.jpg";
import DG from "./images/posts/jpg/dg.jpg";
import BN from "./images/posts/jpg/bn.jpg";
import LC from "./images/posts/jpg/lc.jpg";
import ZA from "./images/posts/jpg/zw.jpg";
import OP_PO from "./images/posts/jpg/op_po.jpg";
import DGW from "./images/posts/jpg/dgw.jpg";
import SG_PO from "./images/posts/jpg/sg_po.jpg";
import T1_BZ from "./images/posts/jpg/t1_bz.jpg";
import IDZ from "./images/posts/jpg/idz.jpg";
import GW_WEBP from "./images/posts/webp/gw.webp";
import PS_WEBP from "./images/posts/webp/ps.webp";
import KN_WEBP from "./images/posts/webp/kn.webp";
import WP_WEBP from "./images/posts/webp/wp.webp";
import OL_WEBP from "./images/posts/webp/ol.webp";
import PI_WEBP from "./images/posts/webp/pi.webp";
import KZ_WEBP from "./images/posts/webp/kz.webp";
import SG_WEBP from "./images/posts/webp/sg.webp";
import DG_WEBP from "./images/posts/webp/dg.webp";
import BN_WEBP from "./images/posts/webp/bn.webp";
import LC_WEBP from "./images/posts/webp/lc.webp";
import ZA_WEBP from "./images/posts/webp/zw.webp";
import OP_PO_WEBP from "./images/posts/webp/op_po.webp";
import DGW_WEBP from "./images/posts/webp/dgw.webp";
import SG_PO_WEBP from "./images/posts/webp/sg_po.webp";
import T1_BZ_WEBP from "./images/posts/webp/t1_bz.webp";
import IDZ_WEBP from "./images/posts/webp/idz.webp";

import { GB, FR, PL, CZ, ES, DE, UA, IT, CN, PT, HU, NL} from 'country-flag-icons/string/3x2'

export const LOGGING = false;

export const countriesFlags: {[k: string]: string} = {
    EN: GB,
    FR,
    PL,
    CZ,
    ES,
    DE,
    UA,
    IT,
    CN,
    PT,
    HU,
    NL
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
    GW,
    PS,
    KN,
    WP,
    OL,
    PI,
    KZ,
    SG,
    DG,
    BN,
    ŁC: LC,
    ZW: ZA,
    OP: OP_PO,
    DW: DGW,
    SPŁ1: SG_PO,
    B: T1_BZ,
    ID: IDZ,
}

export const optimizedPostsWebpImagesMap: {[k: string]: string} = {
    GW: GW_WEBP,
    PS: PS_WEBP,
    KN: KN_WEBP,
    WP: WP_WEBP,
    OL: OL_WEBP,
    PI: PI_WEBP,
    KZ: KZ_WEBP,
    SG: SG_WEBP,
    DG: DG_WEBP,
    BN: BN_WEBP,
    ŁC: LC_WEBP,
    ZW: ZA_WEBP,
    OP: OP_PO_WEBP,
    DW: DGW_WEBP,
    SPŁ1: SG_PO_WEBP,
    B: T1_BZ_WEBP,
    ID: IDZ_WEBP,
}

export const edrImagesMap : {[k: string]: string} = {
    LAYOVER,
    TRACK,
    RIGHT_ARROW,
    BELL,
    CHECK,
}

export const edrWebpImagesMap : {[k: string]: string} = {
    LAYOVER: LAYOVER_WEBP,
    TRACK: TRACK_WEBP,
    RIGHT_ARROW: RIGHT_ARROW_WEBP,
    BELL: BELL_WEBP,
    CHECK: CHECK_WEBP,
}

export const serverTzMap: {[k: string]: string} = {
    FR1: 'Europe/Paris',
    FR2: 'America/Vancouver',
    CZ1: 'Europe/Prague',
    CZ2: 'Europe/Prague',
    DE1: 'Europe/Paris',
    DE2: 'Europe/Paris',
    DE3: 'Europe/Paris',
    DE4: 'Pacific/Honolulu',
    DE5: 'Europe/Paris',
    HU1: 'Europe/Paris',
    UA1: 'Europe/Paris',
    ES1: 'Europe/Paris',
    ES2: 'America/Argentina/Buenos_Aires',
    EN1: 'Europe/London',
    EN2: 'America/New_York',
    EN3: 'America/Vancouver',
    EN4: 'America/Vancouver',
    EN5: 'America/New_York',
    EN6: 'Asia/Sakhalin',
    EN7: 'Europe/London',
    EN8: 'Asia/Sakhalin',
    EN9: 'Europe/Paris',
    IT1: 'Europe/Paris',
    PL1: 'Europe/Warsaw',
    PL2: 'Europe/Warsaw',
    PL3: 'US/Hawaii',
    PL4: 'Europe/Warsaw',
    PL5: 'Europe/Warsaw',
    PL6: 'Europe/Warsaw',
    PL7: 'HST',
    PL8: 'America/Mexico_City',
    CN1: 'Asia/Seoul',
    NL1: 'Europe/London',
}

export const searchSeparator = ','

