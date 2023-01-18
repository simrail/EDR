
import LAYOVER from "./images/layover.png";
import TRACK from './images/track.png';
import RIGHT_ARROW from './images/right-chevron.png';

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

export const edrImagesMap : {[k: string]: any} = {
    LAYOVER,
    TRACK,
    RIGHT_ARROW
}

export const serverTzMap: {[k: string]: string} = {
    FR1: 'Europe/Paris',
    FR2: 'Europe/Paris',
    CZ1: 'Europe/Prague',
    CZ2: 'Europe/Prague',
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
