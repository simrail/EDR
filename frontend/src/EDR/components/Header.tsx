import React from "react";
import {Button, DarkThemeToggle, TextInput} from "flowbite-react";
import {useTranslation} from "react-i18next";
import {DateTimeDisplay} from "./DateTimeDisplay";
import {Bounds} from "./Table";
import {TableHead} from "./TableHead";
import { StationConfig } from "../../config/stations";
import {Link} from "react-router-dom";
import _minBy from "lodash/fp/minBy";

type Props = {
    serverTz: string;
    serverCode: string;
    postCfg: StationConfig;
    displayMode: string;

    bounds: Bounds;
    timetableLength: number;

    setFilter: (value: string | undefined) => void;
    setDisplayMode: (value: "near" | "all") => void;
    setGraphModalOpen: (isOpen: boolean) =>  void;
}


const scrollToNearestTrain = (targetLn: number) => {
    let interval = setInterval(() => {
        const allTrainRows = [...Array.from(document.querySelectorAll('[data-timeoffset]').values())];
        // console_log(allTrainRows.length);
        if (allTrainRows.length === 0 && allTrainRows.length === targetLn)
            return;
        clearInterval(interval);
        const el = _minBy((el) => {
                return el.getAttribute("data-timeoffset") ? Number.parseInt(el.getAttribute("data-timeoffset")!) : 999999;
            }
            , allTrainRows);

        if (el) {
            el.scrollIntoView({
                block: "center"
            })
        }
    }, 1000);
}

export const Header: React.FC<Props> = ({
    serverTz, serverCode, postCfg, displayMode, bounds, timetableLength,
    setFilter, setDisplayMode, setGraphModalOpen
    }) => {
    const {t} = useTranslation();

    const [streamMode, setStreamMode] = React.useState(false);

    React.useEffect(() =>
        scrollToNearestTrain(timetableLength)
    , [timetableLength])


    return (
        <div style={{position: "sticky", top: 0, zIndex: 99999}} className="w-full bg-white shadow-md dark:bg-slate-800">
            <div className="flex items-center justify-between px-4">
                <div className="flex flex-col">
                    <span>{postCfg.srId}</span>
                    <Link to={`/`} className="underline">◀️ {t('EDR_UI_close') ?? ''}</Link>
                </div>
                <DateTimeDisplay serverTz={serverTz} serverCode={serverCode} />
                <div className="flex items-center">
                    <Button size="xs" className="mr-2" onClick={() => setStreamMode(!streamMode)}>Stream mode</Button>
                    <Button size="xs" className="mr-2" onClick={() => setGraphModalOpen(true)}>📈 RCS</Button>
                    <>{t('EDR_UI_dark_light_mode_switch') ?? ''} :&nbsp;</>
                    <DarkThemeToggle />
                </div>
            </div>
            <div className="flex items-center w-full px-4 mt-2">
                <TextInput sizing={streamMode ? "sm" : "md"} id="trainNumberFilter" className="w-full mb-2" onChange={(e) => setFilter(e.target.value)} placeholder={t('EDR_UI_train_number') ?? ''}/>
                <div className="flex mx-4 mb-2">
                    <Button size={streamMode ? "xs" : "md"} className="shrink-0" color={displayMode !== "all" ? "default" : undefined} onClick={() => { setDisplayMode("all"); scrollToNearestTrain(timetableLength); }}>{t('EDR_UI_filter_train_all') ?? ''}</Button>
                    <Button size={streamMode ? "xs" : "md"} className="shrink-0" color={displayMode !== "near" ? "default" : undefined} onClick={() => setDisplayMode("near")}>{t('EDR_UI_filter_train_online') ?? ''}</Button>
                </div>
            </div>
            <div>
                <div>
                    {!streamMode &&
                        <TableHead {...bounds} />
                    }
                </div>
            </div>
        </div>
    )
}