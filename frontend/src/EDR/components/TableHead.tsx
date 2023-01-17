import React from "react";
import {useTranslation} from "react-i18next";
import classNames from "classnames";
import {Bounds} from "./Table";

const tableHeadCommonClassName = "p-4"
export const TableHead: React.FC<Bounds> = ({firstColBounds, secondColBounds, thirdColBounds, fourthColBounds, fifthColBounds, sixthColBounds, seventhColBounds}) => {
    const {t} = useTranslation();
    if (!firstColBounds) return null;
    // console_log("Fourth bou,ds", fourthColBounds)
    return <div className="flex items-center font-bold">
        <div className={tableHeadCommonClassName} style={{minWidth: firstColBounds.width}}>
            {t('edr.train_headers.train_number')}
        </div>
        <div className={classNames(tableHeadCommonClassName, 'text-center')}  style={{minWidth: secondColBounds.width}}>
            {t('edr.train_headers.train_type')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: thirdColBounds.width}}>
            {t('edr.train_headers.train_arrival_time')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: fourthColBounds.width}}>
            {t('edr.train_headers.train_from')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: fifthColBounds.width}}>
            {t('edr.train_headers.train_stop')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: sixthColBounds.width}}>
            {t('edr.train_headers.train_departure_time')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: seventhColBounds.width}}>
            {t('edr.train_headers.train_to')}
        </div>
    </div>;
}