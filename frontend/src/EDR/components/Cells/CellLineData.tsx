import React from "react";
import {useTranslation} from "react-i18next";
import { TimeTableRow } from "../../index";
import {edrImagesMap} from "../../../config";
import { dispatchDirections } from "../../../config/stations";

type Props = {
    ttRow: TimeTableRow;
}
export const CellLineData: React.FC<Props> = ({ttRow}) => {
    const {t} = useTranslation();
    const directions = dispatchDirections[parseInt(ttRow.pointId)];
    const isHeadingLeft = directions.left.includes(parseInt(ttRow.to_post_id));
    const isHeadingRight = directions.right.includes(parseInt(ttRow.to_post_id));
    const isHeadingUp = directions?.up?.includes(parseInt(ttRow.to_post_id));
    const isHeadingDown = directions?.down?.includes(parseInt(ttRow.to_post_id));

    return <>
        <span className="pr-2">
            { isHeadingLeft && <img height={20} width={20} src={edrImagesMap.DIRECTION_LEFT} alt="right-arrow" />}
            { isHeadingRight && <img height={20} width={20} src={edrImagesMap.DIRECTION_RIGHT} alt="left-arrow" />}
            { isHeadingUp && <img height={20} width={20} src={edrImagesMap.DIRECTION_UP} alt="down-arrow" />}
            { isHeadingDown && <img height={20} width={20} src={edrImagesMap.DIRECTION_DOWN} alt="up-arrow" />}
        </span>
        {ttRow.to_post}
        <img className="inline-block pl-1 pb-1" src={edrImagesMap.RIGHT_ARROW} height={18} width={18} alt="r_arrow"/>️
        <b><span className="hidden lg:inline">{t("EDR_TRAINROW_line")}:&nbsp;</span>{ttRow.line}</b>
    </>
}
