import PENDOLINO from "../images/Pendolino.png";
import EU07_IC from "../images/EU07_IC.png";
import TRAXX from "../images/TRAXX.png";
import EN76 from "../images/EN76.png";
import EN96 from "../images/EN96.png";
import EU07_CARGO from "../images/EU07_CARGO.png";
import ET25 from "../images/ET25.png";

export const configByLoco: {[k: string]: {icon: string}} = {
    "Pendolino/ED250-018 Variant": {
        icon: PENDOLINO,
    },
    "4E/EU07-085": {
        icon: EU07_IC
    },
    "4E/EP07-135": {
        icon: EU07_IC,
    },
    "Traxx/Traxx": {
        icon: TRAXX,
    },
    "Traxx/E186-134": {
        icon: TRAXX,
    },
    "Elf/EN76-022": {
        icon: EN76,
    },
    "Elf/EN76-006": {
        icon: EN76,
    },
    "Elf/EN96-001": {
        icon: EN96,
    },
    "4E/EU07-096": {
        icon: EU07_CARGO,
    },
    "4E/4E": {
        icon: EU07_CARGO,
    },
    "Dragon2/ET25-002": {
        icon: ET25,
    }
}
// Service types: https://en.plk-sa.pl/files/public/user_upload/pdf/Reg_przydzielania_tras/Regulamin_sieci_2021_2022/25.02.2022/zal_6.3_Reg21_22_v22_ANG_KOLOR.PDF
export const configByType: {[k: string ]: {color: string, icon: string}} = {
    "ROJ": {
        color: "success",
        icon: EN76
    },
    "MPE": {
        icon: EU07_IC,
        color: "success"
    },
    "MOJ": {
        color: "success",
        icon: EN96
    },
    "ECE": {
        icon: EU07_IC,
        color: "success"
    },
    "EIJ": {
        color: "success",
        icon: PENDOLINO,
    },
    "RPJ": {
        color: "success",
        icon: EN76
    },
    "LTE": {
        color: "gray",
        icon: ET25
    },
    "TME": {
        color: "warning",
        icon: EU07_CARGO
    },
    "TCE": {
        color: "warning",
        icon: ET25
    },
    "TLE": {
        color: "warning",
        icon: EU07_CARGO
    },
}

export type TimeTableServiceType =
    "ECE" |
    "EIJ" |
    "LTE" |
    "MOJ" |
    "MPE" |
    "ROJ" |
    "RPJ" |
    "TCE" |
    "TME";