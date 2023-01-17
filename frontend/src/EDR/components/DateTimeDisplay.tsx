import React from "react";
import {useTranslation} from "react-i18next";
import {formatTime, nowUTC} from "../../utils/date";

type Props = {serverTz: string, serverCode: string};

export const DateTimeDisplay: React.FC<Props> = ({serverTz, serverCode}) => {
    const {i18n} = useTranslation();
    const [dt, setDt] = React.useState(nowUTC(serverTz));

    React.useEffect(() => {
        window.timeRefreshWebWorkerId = window.setInterval(() => {
            setDt(nowUTC(serverTz));
        }, 1000);
        return () => window.clearInterval(window.timeRefreshWebWorkerId)
    }, [serverTz])

    return <div className="text-center">
        <span className="mr-2 text-xl">{formatTime(dt, i18n.language)}</span><br />
        <span className="text-xs">{serverCode.toUpperCase()} / ({serverTz})</span>
    </div>
}