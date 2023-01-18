import React from "react";
import {Button, DarkThemeToggle, TextInput} from "flowbite-react";
import {useTranslation} from "react-i18next";
import {DateTimeDisplay} from "./DateTimeDisplay";
import {Bounds} from "./Table";
import _sortBy from "lodash/fp/sortBy";
import {TableHead} from "./TableHead";

type Props = {
    serverTz: string;
    serverCode: string;
    postCfg: any;
    displayMode: string;

    bounds: Bounds;
    timetableLength: number;

    setFilter: (value: string | undefined) => void;
    setDisplayMode: (value: "near" | "all") => void;
}


const scrollToNearestTrain = (targetLn: number) => {
    let interval = setInterval(() => {
        const allTrainRows = [...Array.from(document.querySelectorAll('[data-timeoffset]').entries())];
        // console_log(allTrainRows.length);
        if (allTrainRows.length === 0 && allTrainRows.length === targetLn)
            return;
        clearInterval(interval);
        const el: any = _sortBy(([idx, el]) => {
                return el.getAttribute("data-timeoffset")
            }
            , allTrainRows);

        // console_log(el[0]);
        el[0][1].scrollIntoView({
            block: "center"
        })
    }, 200);
}

export const Header: React.FC<Props> = ({
    serverTz, serverCode, postCfg, displayMode, bounds, timetableLength,
    setFilter, setDisplayMode
    }) => {
    const {t} = useTranslation();


    React.useEffect(() =>
         scrollToNearestTrain(timetableLength)
    , [])


    return (
        <div style={{position: "sticky", top: 0, zIndex: 99999}} className="w-full bg-white shadow-md dark:bg-slate-800">
            <div className="flex items-center justify-between px-4">
                <div className="flex flex-col">
                    <span>{postCfg.srId}</span>
                    <a href={`/`} className="underline">◀️ {t('edr.ui.close') ?? ''}</a>
                </div>
                <DateTimeDisplay serverTz={serverTz} serverCode={serverCode} />
                <div className="flex items-center">
                    <>{t('edr.ui.dark_light_mode_switch') ?? ''} :&nbsp;</>
                    <DarkThemeToggle />
                </div>
            </div>
            <div className="flex items-center w-full px-4 mt-2">
                <TextInput id="trainNumberFilter" className="w-full mb-2" onChange={(e) => setFilter(e.target.value)} placeholder={t('edr.ui.train_number') ?? ''}/>
                <div className="flex mx-4 mb-2">
                    <Button className="shrink-0" color={displayMode !== "all" ? "default" : undefined} onClick={() => { setDisplayMode("all"); scrollToNearestTrain(timetableLength); }}>{t('edr.ui.filter_train_all') ?? ''}</Button>
                    <Button className="shrink-0" color={displayMode !== "near" ? "default" : undefined} onClick={() => setDisplayMode("near")}>{t('edr.ui.filter_train_online') ?? ''}</Button>
                </div>
            </div>
            <div>
                <div>
                    <TableHead {...bounds} />
                </div>
            </div>
        </div>
    )
}