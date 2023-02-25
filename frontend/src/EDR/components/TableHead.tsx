import React from "react";
import {useTranslation} from "react-i18next";
import classNames from "classnames";
import {Bounds} from "./Table";

const tableHeadCommonClassName = "p-4"
export const TableHead: React.FC<Bounds> = ({firstColBounds, secondColBounds, thirdColBounds, fourthColBounds, fifthColBounds, sixthColBounds, seventhColBounds, showStopColumn}) => {
    const {t} = useTranslation();
    if (!firstColBounds) return null;
    // console_log("Fourth bou,ds", fourthColBounds)
    return <div className="flex items-center font-bold max-w-screen overflow-y-scroll">
        <div className={tableHeadCommonClassName} style={{minWidth: firstColBounds.width}}>
            {t('EDR_TRAINHEADER_train_number')}
        </div>
        <div className={classNames(tableHeadCommonClassName, 'text-center')}  style={{minWidth: secondColBounds.width}}>
            {t('EDR_TRAINHEADER_train_type')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: thirdColBounds.width}}>
            {t('EDR_TRAINHEADER_train_arrival_time')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: fourthColBounds.width}}>
            {t('EDR_TRAINHEADER_train_from')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: fifthColBounds.width}}>
        {showStopColumn && t('EDR_TRAINHEADER_train_stop')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: sixthColBounds.width}}>
            {t('EDR_TRAINHEADER_train_departure_time')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: seventhColBounds.width}}>
            {t('EDR_TRAINHEADER_train_to')}
        </div>
    </div>;
}