import React from "react";
import {Button, DarkThemeToggle, TextInput} from "flowbite-react";
import {useTranslation} from "react-i18next";
import {DateTimeDisplay} from "./DateTimeDisplay";
import {Bounds} from "./Table";
import {TableHead} from "./TableHead";
import { StationConfig } from "../../config/stations";
import {Link} from "react-router-dom";
import _minBy from "lodash/fp/minBy";
import {ColumnFilterModal} from "./CustomFilterModal";
import {FilterConfig, presetFilterConfig} from "../index";

type Props = {
    serverTzOffset: number;
    serverCode: string;
    postCfg: StationConfig;

    bounds: Bounds;
    timetableLength: number;

    setFilter: (value: string | undefined) => void;
    streamMode: boolean;
    setStreamMode: (v: boolean) => void;
    filterConfig: FilterConfig;
    setFilterConfig: (fc: FilterConfig) => void;
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

const getDisplayMode = (filterConfig: FilterConfig) => {
    const _filterConfig = JSON.stringify(filterConfig);
    if (_filterConfig === JSON.stringify(presetFilterConfig.default)) return "default";
    if (_filterConfig === JSON.stringify(presetFilterConfig.near)) return "near";
    if (_filterConfig === JSON.stringify(presetFilterConfig.approaching)) return "approaching";
    return "custom";
}

export const Header: React.FC<Props> = ({
    serverTzOffset, serverCode, postCfg, bounds, timetableLength,
    setFilter, streamMode, setStreamMode, filterConfig, setFilterConfig
}) => {
    const {t} = useTranslation();

    const [configModalOpen, setConfigModaOpen] = React.useState(false);


    React.useEffect(() =>
        scrollToNearestTrain(timetableLength)
    , [timetableLength])

    const displayMode = getDisplayMode(filterConfig);

    return (
        <div style={{position: "sticky", top: 0, zIndex: 99999}} className="w-full bg-white shadow-md dark:bg-slate-800 overflow-y-scroll">
            <div className="flex items-center justify-between px-4  max-w-screen">
                <div className="flex flex-col">
                    <span>{postCfg.srId}</span>
                    <Link to={`/${serverCode}`} className="underline flex">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                        </svg>
                        {!streamMode ? t('EDR_UI_back') : ''}
                    </Link>
                </div>
                <DateTimeDisplay serverTzOffset={serverTzOffset} serverCode={serverCode} />
                <div className="flex items-center">
                    <Button size="xs" className="mr-2" onClick={() => setStreamMode(!streamMode)}>Stream mode</Button>
                    <Button size="xs" className="mr-2" onClick={() => window.open(document.URL + "?graphFullScreenMode=1", "_blank")}>📈 {t("EDR_GRAPH_rcs")}</Button>
                    <>{t('EDR_UI_dark_light_mode_switch') ?? ''} :&nbsp;</>
                    <DarkThemeToggle />
                </div>
            </div>
            <div className="flex items-center justify-between w-full px-4 mt-2">
                <TextInput sizing={streamMode ? "sm" : "md"} id="trainNumberFilter" className="mb-2 min-w-[100px] grow" onChange={(e) => setFilter(e.target.value)} placeholder={t('EDR_UI_train_number') ?? ''}/>
                <div className="flex ml-4 mb-2">
                    <Button size={streamMode ? "xs" : "md"} className="shrink-0" color={displayMode !== "default" ? "default" : undefined}
                            onClick={() => { setFilterConfig(presetFilterConfig.default); scrollToNearestTrain(timetableLength); }}>
                        {t('EDR_UI_filter_train_all') ?? ''}
                    </Button>
                    <Button size={streamMode ? "xs" : "md"} className="shrink-0" color={displayMode !== "near" ? "default" : undefined}
                            onClick={() => setFilterConfig(presetFilterConfig.near)}>
                        {t('EDR_UI_filter_train_online') ?? ''}
                    </Button>
                    <Button size={streamMode ? "xs" : "md"} className="shrink-0" color={displayMode !== "approaching" ? "default" : undefined}
                            onClick={() => setFilterConfig(presetFilterConfig.approaching)}>
                        {t('EDR_UI_filter_train_approaching') ?? ''}
                    </Button>
                    <Button size={streamMode ? "xs" : "md"} className="shrink-0" color={displayMode !== "custom" ? "default" : undefined}
                            onClick={() => setConfigModaOpen(true)}>
                        {t('EDR_UI_filter_custom') ?? ''}
                    </Button>
                </div>
            </div>
            <ColumnFilterModal isOpen={configModalOpen} onClose={() => setConfigModaOpen(false)} setFilterConfig={setFilterConfig} filterConfig={filterConfig}/>
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