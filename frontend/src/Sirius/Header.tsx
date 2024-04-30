import { Train } from "@simrail/types";
import {Button, DarkThemeToggle, Dropdown} from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { countriesFlags } from "../config";
import {DateTimeDisplay} from "../EDR/components/DateTimeDisplay";
import { useTranslation } from "react-i18next";
import { useDarkMode } from "usehooks-ts";

type Props = {
    trainNumber: string;
    trainDetails: Train;
    serverCode: string;
    serverTzOffset: number;
    serverTime: number | undefined;
    autoScroll: boolean;
    showSpeedLimits: boolean;
    setAutoScroll: (v: boolean) => void;
    resetLayout: () => void;
    setShowSpeedLimits: (v: boolean) => void;
    setMapLink: (v: number) => void;
}
export const SiriusHeader: React.FC<Props> = ({trainNumber, trainDetails, serverCode, serverTzOffset, serverTime, autoScroll, showSpeedLimits, setAutoScroll, resetLayout, setShowSpeedLimits, setMapLink}) => {
    const { t } = useTranslation();
    const { toggle } = useDarkMode();

    return (
        <div className="sticky z-20 px-2 t-0 shadow-md w-full flex columns-3 items-center bg-white dark:bg-slate-800 justify-between" style={{overflow: 'auto'}}>
            <div className="flex w-max-content">
                <Link to={`/${serverCode}/trains`} className="flex underline hover:no-underline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                    </svg>
                    {t("DRIVER_DETAILS_back_link")}
                </Link>
                <div className="w-content items-center hidden md:flex">
                    <span className="ml-2 mr-1 child:w-6 child:h-auto shadow-md" dangerouslySetInnerHTML={{ __html: countriesFlags[serverCode.slice(0, 2).toUpperCase()]?.toString() }} />
                        <span className="font-bold mr-2">{serverCode.toUpperCase()}
                    </span>
                    - {trainNumber} - {trainDetails.Vehicles[0]}
                </div>
            </div>
            <div className="flex">
                <DateTimeDisplay serverTzOffset={serverTzOffset} serverCode={serverCode} serverTime={serverTime} hideDetails/>
            </div>
            <div className="flex">
                <div className="flex">
                    <Dropdown label={<>{t("EDR_UI_map_select")}</>} size="sm">
                        <Dropdown.Item onClick={() => setMapLink(0)}>
                            map.simrail.app
                        </Dropdown.Item>
                    </Dropdown>
                </div>
                <div className="flex items-center mx-2">
                    {t('DRIVER_DETAILS_auto_scroll')}: <Button onClick={() => setAutoScroll(!autoScroll)} color={autoScroll ? undefined : 'light'} className="ml-1" size="xs">{autoScroll ? "On" : "Off"}</Button>
                </div>
                <div className="flex items-center mx-2">
                    {t('DRIVER_DETAILS_speed_limits')}: <Button onClick={() => setShowSpeedLimits(!showSpeedLimits)} color={showSpeedLimits ? undefined : 'light'} className="ml-1" size="xs">{showSpeedLimits ? "On" : "Off"}</Button>
                </div>
                <div className="flex items-center ml-0 mx-2">
                    <Button onClick={resetLayout} className="ml-1" color="light" size="xs">Reset Driver View</Button>
                </div>
                <DarkThemeToggle className="!p-0" onClick={() => toggle()}/>
            </div>
        </div>
    )
}
