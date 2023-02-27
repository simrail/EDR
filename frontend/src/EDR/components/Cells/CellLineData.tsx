import React from "react";
import {useTranslation} from "react-i18next";
import { TimeTableRow } from "../../index";
import {edrImagesMap} from "../../../config";

type Props = {
    ttRow: TimeTableRow;
}
export const CellLineData: React.FC<Props> = ({ttRow}) => {
    const {t} = useTranslation();
    return <>
        {ttRow.to_post}
        <img className="inline-block pl-1 pb-1" src={edrImagesMap.RIGHT_ARROW} height={18} width={18} alt="r_arrow"/>️
        <b><span className="hidden lg:inline">{t("EDR_TRAINROW_line")}:&nbsp;</span>{ttRow.line}</b>
    </>
}
