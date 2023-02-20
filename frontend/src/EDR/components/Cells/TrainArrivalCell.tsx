import React from "react";
import {Badge} from "flowbite-react";
import {tableCellCommonClassnames} from "../TrainRow";
import {getDateWithHourAndMinutes, getTimeDelay} from "../../functions/timeUtils";
import {TimeTableRow} from "../../index";
import {DetailedTrain} from "../../functions/trainDetails";
import {useTranslation} from "react-i18next";

type Props = {
    ttRow: TimeTableRow;
    trainDetails: DetailedTrain;
    dateNow: Date;
    serverTzOffset: number;
    trainHasPassedStation: boolean;
    expectedDeparture: Date;
    distanceFromStation: number;
    thirdColRef: any;
    streamMode: boolean;
    arrivalTimeDelay: number;
    departureTimeDelay: number;
}

export const TrainArrivalCell: React.FC<Props> = ({
    ttRow, trainDetails, trainHasPassedStation,
    thirdColRef, distanceFromStation, streamMode, arrivalTimeDelay, departureTimeDelay
}) => {
    const {t} = useTranslation();
    return (
        <td className={tableCellCommonClassnames(streamMode)} ref={thirdColRef}>
            <div className="flex items-center justify-center h-full">
                {ttRow.scheduled_arrival}&nbsp;
                {
                    !trainHasPassedStation && arrivalTimeDelay > 0 && trainDetails && departureTimeDelay > 0
                        ? <span
                            className="text-red-600 font-bold">{t("EDR_TRAINROW_train_late_sign")}{arrivalTimeDelay}</span>
                        : undefined
                }

                {
                    !trainHasPassedStation && arrivalTimeDelay < 0 && trainDetails
                        ? <span
                            className="text-green-600 font-bold">{t("EDR_TRAINROW_train_early_sign")}{Math.abs(arrivalTimeDelay)}</span>
                        : undefined
                }

            </div>
            <div className="flex justify-center">
                {
                    !trainHasPassedStation && arrivalTimeDelay > 5 && trainDetails && departureTimeDelay > 0
                        ? <Badge className="animate-pulse duration-1000"
                                 color="failure">{t('EDR_TRAINROW_train_delayed')}</Badge>
                        : undefined
                }
                {
                    !trainHasPassedStation && arrivalTimeDelay < -5 && distanceFromStation < 4 && trainDetails
                        ? <Badge className="animate-pulse" color="info">{t('EDR_TRAINROW_train_early')}</Badge>
                        : undefined
                }
            </div>
        </td>
    );
}
