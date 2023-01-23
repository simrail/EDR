import React from "react";
import {Badge, Button} from "flowbite-react";
import World from "../../../sounds/world.svg";
import {tableCellCommonClassnames} from "../TrainRow";
import {getPlayer} from "../../../api/api";
import {useTranslation} from "react-i18next";
import {TimeTableRow} from "../../index";
import { DetailedTrain } from "../../functions/trainDetails";
import {configByLoco} from "../../../config/trains";

const getPlayerDetails = (controlledBy: string | null | undefined, setState: (value: any | undefined) => void) => {
    if (!controlledBy) {
        setState(undefined);
        return;
    }
    getPlayer(controlledBy).then((res) => {
        if (res[0])
            setState(res[0]);
    }).catch(() => {
        setTimeout(() => getPlayerDetails(controlledBy, setState), 1000);
    })
}

type Props = {
    ttRow: TimeTableRow;
    trainDetails: DetailedTrain;
    trainBadgeColor: string;
    hasEnoughData: boolean;
    setModalTrainId: (trainId: string | undefined) => void;
    firstColRef: any;
    distanceFromStation: number;
    currentDistance: number;
    previousDistance: number | undefined;
    trainHasPassedStation: boolean;

}
export const TrainInfoCell: React.FC<Props> = ({
       ttRow, trainDetails, hasEnoughData, trainBadgeColor,
       distanceFromStation, previousDistance, currentDistance, trainHasPassedStation,
       setModalTrainId, firstColRef
}) => {
    const {t} = useTranslation();
    const [playerSteamInfo, setPlayerSteamInfo] = React.useState<any>();
    const ETA = trainDetails?.TrainData?.Velocity ? (distanceFromStation / trainDetails.TrainData.Velocity) * 60 : undefined;
    const controlledBy = trainDetails?.TrainData?.ControlledBySteamID;
    const trainConfig = configByLoco[trainDetails?.Vehicles[0]];


    React.useEffect(() => getPlayerDetails(controlledBy, setPlayerSteamInfo), [controlledBy]);

    return (
        <td className={tableCellCommonClassnames} ref={firstColRef}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Badge color={trainBadgeColor} size="sm"><span className="!font-bold text-lg">{ttRow.train_number}</span></Badge>
                    { trainDetails && <span className="ml-2">
                        <Button size="xs" onClick={() => !!trainDetails && setModalTrainId(ttRow.train_number)}><img src={World} height={16} width={16} alt="Show on map"/></Button>
                    </span> }
                </div>
                <div className="flex md:inline">
                    <div className="flex justify-end">
                        {trainConfig?.icon && <img src={trainConfig.icon} height={50} width={64} alt="train-icon"/>}
                    </div>
                    <div className="flex justify-center">
                        {
                            !hasEnoughData && trainDetails?.TrainData?.Velocity > 0 && <span>⚠️ {t("edr.train_row.waiting_for_data")}</span>
                        }
                        {
                            playerSteamInfo?.pseudo
                                ? <span className="flex items-center"><img className="mx-2" width={16} src={playerSteamInfo.avatar} alt="avatar" />{playerSteamInfo?.pseudo}</span>
                                : <></>
                        }
                    </div>
                </div>
            </div>
            <div className="w-full">
                {  distanceFromStation
                    ? <>{t("edr.train_row.position_at")} {distanceFromStation}km ({trainDetails?.closestStation})</>
                    : <>{t('edr.train_row.train_offline')}</>
                }
                &nbsp;
                {
                    distanceFromStation
                        ? previousDistance === currentDistance
                            ? <>&nbsp;- {t('edr.train_row.train_stopped')}</>
                            : trainHasPassedStation ?
                                <>&nbsp;- {t("edr.train_row.train_away")}</>
                                : ETA && Math.round(ETA) < 20
                                    ? <>&nbsp;- {Math.round(ETA)}{t("edr.train_row.train_minutes")}</>
                                    : trainDetails?.TrainData?.Velocity === 0 ? <>&nbsp;- {t('edr.train_row.train_stopped')}</> : undefined
                        : undefined
                }
            </div>
        </td>
    )
}
