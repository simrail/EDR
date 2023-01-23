import React from "react";
import {TimeTableRow} from "../../index";
import {tableCellCommonClassnames} from "../TrainRow";
import {useTranslation} from "react-i18next";
import {edrImagesMap} from "../../../config";

const PlatformData: React.FC<{ttRow: TimeTableRow}> = ({ttRow}) => {
    const {t} = useTranslation();
    return ttRow.platform || Math.ceil(parseInt(ttRow.layover)) !== 0 ? (
        <>
            <img className="inline-block pr-1" src={edrImagesMap.LAYOVER} height={26} width={26} alt="layover"/> {Math.floor(parseInt(ttRow.layover))} {t("edr.train_row.layover_minutes")}
            {ttRow.platform && <><img className="ml-2 inline-block pl-1" src={edrImagesMap.TRACK} height={26} width={26} alt="track"/> {ttRow.platform.split(' ')[0]} / {ttRow.platform.split(' ')[1]}</>}
        </>
    ) : null
}

type Props = {
    ttRow: TimeTableRow;
    headerFifthColRef: any;
    secondaryPostData: TimeTableRow[];
}

export const TrainPlatformCell: React.FC<Props> = ({headerFifthColRef, ttRow, secondaryPostData}) => {
    return <td className={tableCellCommonClassnames} ref={headerFifthColRef}>
        <PlatformData ttRow={ttRow} />
        { secondaryPostData.map((spd: TimeTableRow) => <><hr /><PlatformData ttRow={spd} /></>)}
    </td>
}
