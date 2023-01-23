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
    serverTz: string;
    trainHasPassedStation: boolean;
    expectedDeparture: Date;
    distanceFromStation: number;

    thirdColRef: any;
}

export const TrainArrivalCell: React.FC<Props> = ({
    dateNow, ttRow, trainDetails, trainHasPassedStation, serverTz,
    thirdColRef, expectedDeparture, distanceFromStation
}) => {
    const {t} = useTranslation();
    const [arrivalExpectedHours, arrivalExpectedMinutes] = ttRow.scheduled_arrival.split(":").map(value => parseInt(value));
    const isArrivalNextDay = dateNow.getHours() > 20 && arrivalExpectedHours < 12;  // TODO: less but still clunky
    const isArrivalPreviousDay = arrivalExpectedHours > 20 && dateNow.getHours() < 12; // TODO: less but still Clunky
    const expectedArrival = getDateWithHourAndMinutes(arrivalExpectedHours, arrivalExpectedMinutes, serverTz);
    const arrivalTimeDelay = getTimeDelay(isArrivalNextDay, isArrivalPreviousDay, dateNow, expectedArrival);
    const departureTimeDelay = getTimeDelay(isArrivalNextDay, isArrivalPreviousDay, dateNow, expectedDeparture);


    return (
        <td className={tableCellCommonClassnames} ref={thirdColRef}>
            <div className="flex items-center justify-center h-full">
                {ttRow.scheduled_arrival}&nbsp;
                {
                    !trainHasPassedStation && arrivalTimeDelay > 0 && trainDetails
                        ? <span
                            className="text-red-600 font-bold">{t("edr.train_row.train_late_sign")}{arrivalTimeDelay}</span>
                        : undefined
                }

                {
                    !trainHasPassedStation && arrivalTimeDelay < 0 && trainDetails
                        ? <span
                            className="text-green-600 font-bold">{t("edr.train_row.train_early_sign")}{Math.abs(arrivalTimeDelay)}</span>
                        : undefined
                }

            </div>
            <div className="flex justify-center">
                {
                    !trainHasPassedStation && arrivalTimeDelay > 5 && trainDetails && departureTimeDelay > 0
                        ? <Badge className="animate-pulse duration-1000"
                                 color="failure">{t('edr.train_row.train_delayed')}</Badge>
                        : undefined
                }
                {
                    !trainHasPassedStation && arrivalTimeDelay < -5 && distanceFromStation < 4 && trainDetails
                        ? <Badge className="animate-pulse" color="info">{t('edr.train_row.train_early')}</Badge>
                        : undefined
                }
            </div>
        </td>
    );
}
