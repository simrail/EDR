import React from "react";
import {TimeTableRow} from "../../index";
import {tableCellCommonClassnames} from "../TrainRow";
import {useTranslation} from "react-i18next";
import {edrImagesMap} from "../../../config";
import Tooltip from "rc-tooltip";

const PlatformData: React.FC<{ttRow: TimeTableRow}> = ({ttRow}) => {
    const {t} = useTranslation();
    return ttRow.platform || Math.ceil(parseInt(ttRow.layover)) !== 0 ? (
        <div className="flex items-center flex-col lg:flex-row align-center">
            <span className="flex">
                <Tooltip placement="top" overlay={<span>{t("EDR_TRAINROW_layover")}</span>}>
                    <img id="layover_test" className="h-[13px] lg:h-[26px] mx-2" src={edrImagesMap.LAYOVER} alt="layover" />
                </Tooltip>
                {Math.floor(parseInt(ttRow.layover))}&nbsp;{t("EDR_TRAINROW_layover_minutes")}
            </span>
            <span className="flex">
                {ttRow.platform && <>
                    <Tooltip placement="top" overlay={<span>{t("EDR_TRAINROW_platform")}</span>}>
                        <img className="mx-2 pl-1 h-[13px] lg:h-[26px]" src={edrImagesMap.TRACK} alt="track"/>
                    </Tooltip>
                    {ttRow.platform.split(' ')[0]}&nbsp;/&nbsp;{ttRow.platform.split(' ')[1]}</>}
            </span>
        </div>
    ) : null
}

type Props = {
    ttRow: TimeTableRow;
    headerFifthColRef: any;
    secondaryPostData: TimeTableRow[];
    streamMode: boolean;
}

export const TrainPlatformCell: React.FC<Props> = ({headerFifthColRef, ttRow, secondaryPostData, streamMode}) => {
    return <td className={tableCellCommonClassnames(streamMode)} ref={headerFifthColRef}>
        <PlatformData ttRow={ttRow} />
        { secondaryPostData.map((spd: TimeTableRow, i: number) => <span key={spd.train_number + i}><hr /><PlatformData ttRow={spd} /></span>)}
    </td>
}
