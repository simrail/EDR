import React from "react";
import {Badge, Button} from "flowbite-react";
import { useSnackbar } from "notistack";
import World from "../../../sounds/world.svg";
import {tableCellCommonClassnames} from "../TrainRow";
import {getPlayer} from "../../../api/api";
import {useTranslation} from "react-i18next";
import {TimeTableRow} from "../../index";
import { DetailedTrain } from "../../functions/trainDetails";
import {configByLoco} from "../../../config/trains";
import Tooltip from "rc-tooltip";
import classNames from "classnames";
import TimetableIcon from "../../../images/icons/png/timetable.png";
import ScheduleIcon from "../../../images/icons/png/schedule.png";
import { Link } from "react-router-dom";

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
    setTimetableTrainId: (trainId: string | undefined) => void;
    firstColRef: any;
    distanceFromStation: number;
    currentDistance: number;
    previousDistance: number | undefined;
    trainHasPassedStation: boolean;
    isWebpSupported: boolean;
    streamMode: boolean;
    serverCode: string;
}
export const TrainInfoCell: React.FC<Props> = ({
       ttRow, trainDetails, hasEnoughData, trainBadgeColor,
       distanceFromStation, previousDistance, currentDistance, trainHasPassedStation,
       setModalTrainId, firstColRef, isWebpSupported, streamMode, setTimetableTrainId, serverCode
}) => {
    const {t} = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [playerSteamInfo, setPlayerSteamInfo] = React.useState<any>();
    const ETA = trainDetails?.TrainData?.Velocity ? (distanceFromStation / trainDetails.TrainData.Velocity) * 60 : undefined;
    const controlledBy = trainDetails?.TrainData?.ControlledBySteamID;
    const trainConfig = configByLoco[trainDetails?.Vehicles[0]];
    const trainIcon = isWebpSupported ? trainConfig?.iconWebp : trainConfig?.icon;

    React.useEffect(() => getPlayerDetails(controlledBy, setPlayerSteamInfo), [controlledBy]);

    const CopyToClipboard = (stringToCopy: string) => {
        navigator.clipboard.writeText(stringToCopy);
        enqueueSnackbar(t('EDR_TRAINROW_copied'), { preventDuplicate: true, variant: 'success' });
    }

    return (
        <td className={tableCellCommonClassnames(streamMode)} ref={firstColRef}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Tooltip placement="top" overlay={<span>{t("EDR_TRAINROW_click_to_copy")}</span>}>
                        <Badge color={trainBadgeColor} size={streamMode ? "xs" : "sm"}>
                            <span className={classNames("!font-bold cursor-pointer", streamMode ? "text-base" : "text-lg")} onClick={() => CopyToClipboard(ttRow.train_number)}>
                                {ttRow.train_number}
                            </span>
                        </Badge>
                    </Tooltip>
                    { trainDetails && <span className="ml-1 flex">
                        <Tooltip placement="right" overlay={<span>{t("EDR_TRAINROW_show_on_map")}</span>}>
                            <Button size="xs" onClick={() => !!trainDetails && setModalTrainId(ttRow.train_number)}><img src={World} height={streamMode ? 8 : 16} width={streamMode ? 8 : 16} alt="Show on map"/></Button>
                        </Tooltip>
                        <Tooltip placement="right" overlay={<span>{t("EDR_TRAINROW_show_timetable")}</span>}>
                            <Button size="xs" className="ml-1" onClick={() => setTimetableTrainId(ttRow.train_number)}><img src={TimetableIcon} height={streamMode ? 8 : 16} width={streamMode ? 8 : 16} alt="Show timetable"/></Button>
                        </Tooltip>
                        <Tooltip placement="right" overlay={<span>{t("EDR_TRAINROW_switch_to_driver_view")}</span>}>
                            <Link to={`/${serverCode}/train/${ttRow.train_number}`}>
                                <Button size="xs" className="ml-1" href=""><img src={ScheduleIcon} height={streamMode ? 8 : 16} width={streamMode ? 8 : 16} alt="Show timetable"/></Button>
                            </Link>
                        </Tooltip>
                    </span> }
                </div>
                <div className="flex md:inline">
                    <div className="flex justify-end">
                        {trainConfig?.icon && <span className="hidden lg:block"><img src={trainIcon} height={streamMode ? 30 : 40} width={streamMode ? 52 : 94} alt="train-icon"/></span>}
                    </div>
                    <div className="flex justify-end">
                        {
                            playerSteamInfo?.pseudo
                                ? <span className="flex items-center"><span className="hidden md:inline">{streamMode ? '' : playerSteamInfo?.pseudo}</span><img className="mx-2" width={16} src={playerSteamInfo.avatar} alt="avatar" /></span>
                                : <></>
                        }
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col md:flex-row">
                {  distanceFromStation
                    ? <div className="inline-flex"><span className="hidden md:inline">{t("EDR_TRAINROW_position_at")}&nbsp;</span>{distanceFromStation}km&nbsp;<div className="max-w-[70px] md:max-w-full max-h-[1rem] overflow-hidden">{trainDetails?.closestStation}</div></div>
                    : <>{t('EDR_TRAINROW_train_offline')}</>
                }
                &nbsp;
                {
                    distanceFromStation
                        ? previousDistance === currentDistance
                            ? <>{t('EDR_TRAINROW_train_stopped')}</>
                            : trainHasPassedStation ?
                                <>{t("EDR_TRAINROW_train_away")}</>
                                : ETA && Math.round(ETA) < 20
                                    ? <>{Math.round(ETA)}{t("EDR_TRAINROW_train_minutes")}</>
                                    : trainDetails?.TrainData?.Velocity === 0 ? <>{t('EDR_TRAINROW_train_stopped')}</> : undefined
                        : undefined
                }
            </div>
        </td>
    )
}
