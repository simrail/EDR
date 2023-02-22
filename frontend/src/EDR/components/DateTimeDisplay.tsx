import React from "react";
import {useTranslation} from "react-i18next";
import {timeOptions, formatTime, nowUTC} from "../../utils/date";

type Props = {serverTzOffset: number, serverCode: string};

export const DateTimeDisplay: React.FC<Props> = ({serverTzOffset, serverCode}) => {
    const {i18n} = useTranslation();
    const [dt, setDt] = React.useState(nowUTC(serverTzOffset));

    React.useEffect(() => {
        window.timeRefreshWebWorkerId = window.setInterval(() => {
            setDt(nowUTC(serverTzOffset));
        }, 1000);
        return () => window.clearInterval(window.timeRefreshWebWorkerId)
    }, [serverTzOffset])

    return <div className="text-center">
        <span className="mr-2 text-xl">{formatTime(dt, i18n.language, timeOptions)}</span><br />
        <span className="text-xs">{serverCode.toUpperCase()} / (UTC {serverTzOffset})</span>
    </div>
}