import ED250_PENDOLINO from "../images/ED250-Pendolino.png";
import EU07_IC from "../images/EU07_IC.png";
import E186_TRAXX from "../images/E186-TRAXX.png";
import EN76_006 from "../images/EN76-006.png";
import EN76_022 from "../images/EN76-022.png";
import EN96_001 from "../images/EN96-001.png";
import EP07_135 from '../images/EP07-135.png';
import EU07_CARGO from "../images/EU07_CARGO.png";
import ET25_DRAGON from "../images/ET25-Dragon.png";

export const configByLoco: {[k: string]: {icon: string}} = {
    "Pendolino/ED250-018 Variant": {
        icon: ED250_PENDOLINO,
    },
    "4E/EU07-085": {
        icon: EU07_IC
    },
    "4E/EP07-135": {
        icon: EP07_135,
    },
    "Traxx/Traxx": {
        icon: E186_TRAXX,
    },
    "Traxx/E186-134": {
        icon: E186_TRAXX,
    },
    "Elf/EN76-022": {
        icon: EN76_022,
    },
    "Elf/EN76-006": {
        icon: EN76_006,
    },
    "Elf/EN96-001": {
        icon: EN96_001,
    },
    "4E/EU07-096": {
        icon: EU07_CARGO,
    },
    "4E/4E": {
        icon: EU07_CARGO,
    },
    "Dragon2/ET25-002": {
        icon: ET25_DRAGON,
    },
    "Dragon2/E6ACTad": {
        icon: ET25_DRAGON,
    }
}
// Service types: https://en.plk-sa.pl/files/public/user_upload/pdf/Reg_przydzielania_tras/Regulamin_sieci_2021_2022/25.02.2022/zal_6.3_Reg21_22_v22_ANG_KOLOR.PDF
export const configByType: {[k: string ]: {color: string, graphColor: string}} = {
    "ROJ": {
        color: "success",
        graphColor: "green",
    },
    "MPE": {
        graphColor: "green",
        color: "success"
    },
    "MOJ": {
        color: "success",
        graphColor: "green",
    },
    "ECE": {
        graphColor: "blue",
        color: "success"
    },
    "EIJ": {
        color: "success",
        graphColor: "red",
    },
    "RPJ": {
        color: "success",
        graphColor: "green",
    },
    "LTE": {
        color: "gray",
        graphColor: "gray",
    },
    "TME": {
        color: "warning",
        graphColor: "orange",
    },
    "TCE": {
        color: "warning",
        graphColor: "orange",
    },
    "TLE": {
        color: "warning",
        graphColor: "orange",
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