import React from "react";
import {useTranslation} from "react-i18next";
import {timeOptions, formatTime, nowUTC} from "../../utils/date";
import { getTzNumberSign } from "../functions/numberUtils";
import { addSeconds } from "date-fns";

type Props = {serverTzOffset: number, serverTime: number | undefined, serverCode: string, hideDetails?: boolean};

export const DateTimeDisplay: React.FC<Props> = ({serverTzOffset, serverTime, serverCode, hideDetails = false}) => {
    const {i18n} = useTranslation();
    const [dt, setDt] = React.useState(nowUTC(serverTime, serverTzOffset));
    React.useEffect(() => {
        window.timeRefreshWebWorkerId = window.setInterval(() => {
            setDt(addSeconds(dt, 1));
        }, 1000);
        return () => window.clearInterval(window.timeRefreshWebWorkerId)
    }, [dt])

    return <div className="text-center">
        <span className="mr-2 text-xl">{formatTime(dt, i18n.language, timeOptions)}</span>
        {!hideDetails && <><br /><span className="text-xs">{serverCode.toUpperCase()} / (UTC{serverTzOffset !== 0 && ` ${getTzNumberSign(serverTzOffset)}${serverTzOffset}`})</span></> }
    </div>
}