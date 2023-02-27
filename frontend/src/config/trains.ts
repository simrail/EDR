import ED250_PENDOLINO from "../images/trains/png/ED250-Pendolino.png";
import EU07_IC from "../images/trains/png/EU07_IC.png";
import E186_TRAXX from "../images/trains/png/E186-TRAXX.png";
import EN76_006 from "../images/trains/png/EN76-006.png";
import EN76_022 from "../images/trains/png/EN76-022.png";
import EN96_001 from "../images/trains/png/EN96-001.png";
import EP07_135 from '../images/trains/png/EP07-135.png';
import EU07_CARGO from "../images/trains/png/EU07_CARGO.png";
import ET25_DRAGON from "../images/trains/png/ET25-Dragon.png";
import ED250_PENDOLINO_WEBP from "../images/trains/webp/ED250-Pendolino.webp";
import EU07_IC_WEBP from "../images/trains/webp/EU07_IC.webp";
import E186_TRAXX_WEBP from "../images/trains/webp/E186-TRAXX.webp";
import EN76_006_WEBP from "../images/trains/webp/EN76-006.webp";
import EN76_022_WEBP from "../images/trains/webp/EN76-022.webp";
import EN96_001_WEBP from "../images/trains/webp/EN96-001.webp";
import EP07_135_WEBP from '../images/trains/webp/EP07-135.webp';
import EU07_CARGO_WEBP from "../images/trains/webp/EU07_CARGO.webp";
import ET25_DRAGON_WEBP from "../images/trains/webp/ET25-Dragon.webp";

export const configByLoco: {[k: string]: {icon: string, iconWebp: string}} = {
    "Pendolino/ED250-018 Variant": {
        icon: ED250_PENDOLINO,
        iconWebp: ED250_PENDOLINO_WEBP
    },
    "4E/EU07-085": {
        icon: EU07_IC,
        iconWebp: EU07_IC_WEBP
    },
    "4E/EP07-135": {
        icon: EP07_135,
        iconWebp: EP07_135_WEBP
    },
    "Traxx/Traxx": {
        icon: E186_TRAXX,
        iconWebp: E186_TRAXX_WEBP
    },
    "Traxx/E186-134": {
        icon: E186_TRAXX,
        iconWebp: E186_TRAXX_WEBP
    },
    "Elf/EN76-022": {
        icon: EN76_022,
        iconWebp: EN76_022_WEBP
    },
    "Elf/EN76-006": {
        icon: EN76_006,
        iconWebp: EN76_006_WEBP
    },
    "Elf/EN96-001": {
        icon: EN96_001,
        iconWebp: EN96_001_WEBP
    },
    "4E/EU07-096": {
        icon: EU07_CARGO,
        iconWebp: EU07_CARGO_WEBP
    },
    "4E/4E": {
        icon: EU07_CARGO,
        iconWebp: EU07_CARGO_WEBP
    },
    "Dragon2/ET25-002": {
        icon: ET25_DRAGON,
        iconWebp: ET25_DRAGON_WEBP
    },
    "Dragon2/E6ACTad": {
        icon: ET25_DRAGON,
        iconWebp: ET25_DRAGON_WEBP
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
        graphColor: "LawnGreen",
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