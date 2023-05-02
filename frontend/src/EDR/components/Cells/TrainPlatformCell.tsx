import React from "react";
import {tableCellCommonClassnames} from "../TrainRow";
import {useTranslation} from "react-i18next";
import {edrImagesMap} from "../../../config";
import Tooltip from "rc-tooltip";
import { TimeTableRow } from "../../../customTypes/TimeTableRow";

const PlatformData: React.FC<{ttRow: TimeTableRow}> = ({ttRow}) => {
    const {t} = useTranslation();
    return ttRow.platform?.replace(" ", '') || Math.ceil(ttRow.plannedStop) !== 0 ? (
        <div className="flex items-center flex-col lg:flex-row align-center">
            <span className="flex">
                <Tooltip placement="top" overlay={<span>{t("EDR_TRAINROW_layover")}</span>}>
                    <img id="layover_test" className="h-[13px] lg:h-[20px] mx-2" src={edrImagesMap.LAYOVER} alt="layover" />
                </Tooltip>
                {Math.floor(ttRow.plannedStop)}&nbsp;{t("EDR_TRAINROW_layover_minutes")}
            </span>
            <span className="flex">
                {ttRow.platform && <>
                    <Tooltip placement="top" overlay={<span>{t("EDR_TRAINROW_platform")}</span>}>
                        <img className="mx-2 pl-1 h-[13px] lg:h-[20px]" src={edrImagesMap.TRACK} alt="track"/>
                    </Tooltip>
                    {ttRow.platform}&nbsp;/&nbsp;{ttRow.track}</>
                }
            </span>
        </div>
    ) : null;
};

type Props = {
    ttRow: TimeTableRow;
    headerFifthColRef: any;
    secondaryPostData: TimeTableRow[];
    streamMode: boolean;
};

export const TrainPlatformCell: React.FC<Props> = ({headerFifthColRef, ttRow, secondaryPostData, streamMode}) => {
    return <td className={tableCellCommonClassnames(streamMode)} ref={headerFifthColRef} width="170">
        <PlatformData ttRow={ttRow} />
        { secondaryPostData.map((spd: TimeTableRow, i: number) => {
            if (spd.platform) {
                return (
                    <span key={spd.trainNoLocal + i}>
                        <hr />
                        <PlatformData ttRow={spd} />
                    </span>
                )
            } else {
                return <span key={spd.trainNoLocal + i}></span>; 
            }
        })}
    </td>
};
