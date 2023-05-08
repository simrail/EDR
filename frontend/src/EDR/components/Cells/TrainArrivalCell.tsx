import React from "react";
import {Badge} from "flowbite-react";
import {tableCellCommonClassnames} from "../TrainRow";
import {DetailedTrain} from "../../functions/trainDetails";
import {useTranslation} from "react-i18next";
import { format } from "date-fns";
import { TimeTableRow } from "../../../customTypes/TimeTableRow";

type Props = {
    ttRow: TimeTableRow;
    trainDetails: DetailedTrain;
    trainHasPassedStation: boolean;
    thirdColRef: any;
    streamMode: boolean;
    arrivalTimeDelay: number;
}

export const TrainArrivalCell: React.FC<Props> = ({
    ttRow, trainDetails, trainHasPassedStation,
    thirdColRef, streamMode, arrivalTimeDelay
}) => {
    const {t} = useTranslation();
    return (
        <td className={tableCellCommonClassnames(streamMode)} width="150" ref={thirdColRef}>
            <div className="flex items-center justify-center h-full">
                {format(ttRow.scheduledArrivalObject, 'HH:mm')}&nbsp;
                {
                    !trainHasPassedStation && arrivalTimeDelay > 0
                        ? <span
                            className="text-red-600 font-bold">{t("EDR_TRAINROW_train_late_sign")}{arrivalTimeDelay}</span>
                        : undefined
                }

                {
                    !trainHasPassedStation && arrivalTimeDelay < 0
                        ? <span
                            className="text-green-600 font-bold">{t("EDR_TRAINROW_train_early_sign")}{Math.abs(arrivalTimeDelay)}</span>
                        : undefined
                }

            </div>
            <div className="flex justify-center">
                {
                    !trainHasPassedStation && arrivalTimeDelay > 5 && trainDetails?.distanceFromStation < 5
                        ? <Badge className="animate-pulse duration-1000"
                                 color="failure">{t('EDR_TRAINROW_train_delayed')}</Badge>
                        : undefined
                }
                {
                    !trainHasPassedStation && arrivalTimeDelay < -5 && trainDetails?.distanceFromStation < 5
                        ? <Badge className="animate-pulse" color="info">{t('EDR_TRAINROW_train_early')}</Badge>
                        : undefined
                }
            </div>
        </td>
    );
}
