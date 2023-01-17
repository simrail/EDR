import React from "react";
import {Spinner} from "flowbite-react";
import {useTranslation} from "react-i18next";

type Props = {
    timetable: any;
    trains: any;
    stations: any;
}
export const LoadingScreen: React.FC<Props> = ({timetable, trains, stations}) => {
    const {t} = useTranslation();

    return <div className="min-h-screen flex flex-col justify-center items-center text-center">
        <div>{t('edr.loading.main_message')}</div>
        <div>{t("edr.loading.schedules")}: {!timetable ? <Spinner size="xs"/> : <>✓</>}</div>
        <div>{t("edr.loading.stations")}: {!stations ? <Spinner size="xs"/> : <>✓</>}</div>
        <div>{t("edr.loading.trains")}: {!trains ? <Spinner size="xs"/> : <>✓</>}</div>
    </div>
}