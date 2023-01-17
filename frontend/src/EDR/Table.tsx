import React from "react";
import {Table, TextInput, Label, Button, Checkbox, Spinner, DarkThemeToggle, Badge} from "flowbite-react";
import {configByType, postConfig, searchSeparator} from "../config";
import _sortBy from "lodash/fp/sortBy";
import TableRow from "./TrainRow";
import {StringParam, useQueryParam} from "use-query-params";
import {useTranslation} from "react-i18next";
import useMeasure from "react-use-measure";
import classNames from "classnames";
import {formatTime, nowUTC} from "../utils/date";
import {useSoundNotification} from "./hooks/useSoundNotification";
import {SimRailMapModal} from "./SimRailMapModal";

const tableHeadCommonClassName = "p-4"
const TableHead: React.FC<any> = ({firstColBounds, secondColBounds, thirdColBounds, fourthColBounds, fifthColBounds, sixthColBounds, seventhColBounds}) => {
    const {t} = useTranslation();
    if (!firstColBounds) return null;
    // console_log("Fourth bou,ds", fourthColBounds)
    return <div className="flex items-center font-bold">
        <div className={tableHeadCommonClassName} style={{minWidth: firstColBounds.width}}>
            {t('edr.train_headers.train_number')}
        </div>
        <div className={classNames(tableHeadCommonClassName, 'text-center')}  style={{minWidth: secondColBounds.width}}>
            {t('edr.train_headers.train_type')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: thirdColBounds.width}}>
                {t('edr.train_headers.train_arrival_time')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: fourthColBounds.width}}>
            {t('edr.train_headers.train_from')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: fifthColBounds.width}}>
            {t('edr.train_headers.train_stop')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: sixthColBounds.width}}>
                {t('edr.train_headers.train_departure_time')}
        </div>
        <div className={tableHeadCommonClassName} style={{width: seventhColBounds.width}}>
            {t('edr.train_headers.train_to')}
        </div>
    </div>;
}

const DateTimeDisplay: React.FC<{serverTz: string, serverCode: string}> = ({serverTz, serverCode}) => {
    const {i18n} = useTranslation();
    const [dt, setDt] = React.useState(nowUTC(serverTz));

    React.useEffect(() => {
        window.timeRefreshWebWorkerId = window.setInterval(() => {
            setDt(nowUTC(serverTz));
        }, 1000);
        return () => window.clearInterval(window.timeRefreshWebWorkerId)
    }, [])

    return <div className="text-center">
        <span className="mr-2 text-xl">{formatTime(dt, i18n.language)}</span><br />
        <span className="text-xs">{serverCode.toUpperCase()} / ({serverTz})</span>
        {/* !cdnBypass
            ? <span className="inline-flex items-center text-info-700">Slow refresh? Click <Button className="mx-2" size="xs" onClick={() => {
                setCdnBypass("bypass");
                window.history.go();
            }}>
                here</Button> and contact me please !</span>
            : <span className="text-info-700">Bypassing CDN</span>
        */}
    </div>
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

export const EDRTable: React.FC<any> = ({timetable, trainsWithHaversine, serverTz}) => {
    const [postQry] = useQueryParam('post', StringParam);
    const [displayMode, setDisplayMode] = React.useState<string>("all");
    const [filter, setFilter] = React.useState<string | undefined>();
    const [modalTrainId, setModalTrainId] = React.useState<string | undefined>();
    const {t, i18n} = useTranslation();
    const [SoundNotification, playSoundNotification] = useSoundNotification();

    const [headerFirstColRef, firstColBounds] = useMeasure();
    const [headerSecondColRef, secondColBounds] = useMeasure();
    const [headerThirdColRef, thirdColBounds] = useMeasure();
    const [headerFourthColRef, fourthColBounds] = useMeasure();
    const [headerFifthColRef, fifthColBounds] = useMeasure();
    const [headerSixthhColRef, sixthColBounds] = useMeasure();
    const [headerSeventhColRef, seventhColBounds] = useMeasure();

    const dt = nowUTC(serverTz);
    const [betaToken] = useQueryParam('betaToken', StringParam);
    const [serverCode] = useQueryParam('serverCode', StringParam) as any;


    if (!trainsWithHaversine || !postQry) return null;
    const postCfg = postConfig[postQry];


    return <div>
        <SimRailMapModal serverCode={serverCode} trainId={modalTrainId} setModalTrainId={setModalTrainId} />
        <SoundNotification />
        <div style={{position: "sticky", top: 0, zIndex: 99999}} className="w-full bg-white shadow-md dark:bg-slate-800">
            <div className="flex items-center justify-between px-4">
                <div className="flex flex-col">
                    <span>{postCfg.srId}</span>
                    <a href={`/?betaToken=${betaToken}`} className="underline">◀️ {t('edr.ui.close') ?? ''}</a>
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
                <Button className="shrink-0" color={displayMode !== "all" ? "default" : undefined} onClick={() => { setDisplayMode("all"); scrollToNearestTrain(timetable.length); }}>{t('edr.ui.filter_train_all') ?? ''}</Button>
                <Button className="shrink-0" color={displayMode !== "near" ? "default" : undefined} onClick={() => setDisplayMode("near")}>{t('edr.ui.filter_train_online') ?? ''}</Button>
                </div>
            </div>
            <div>
                <div>
                    <TableHead
                        firstColBounds={firstColBounds}
                        secondColBounds={secondColBounds}
                        thirdColBounds={thirdColBounds}
                        fourthColBounds={fourthColBounds}
                        fifthColBounds={fifthColBounds}
                        sixthColBounds={sixthColBounds}
                        seventhColBounds={seventhColBounds}
                    />
                </div>
            </div>
        </div>
        <div>
            <Table striped={true}>
            <Table.Body>
                {timetable.length > 0
                    ? timetable
                        .filter((tt: any) => filter ? 
                            // Remove spaces, trim not enough since humans usually use space after a separator
                            filter.replace(/\s+/g, '')
                            // Separate train numbers
                            .split(searchSeparator)
                            // Remove empty values (if last char is separator, no filtering would occur due to empty string)
                            .filter(n => n)
                            // If any train numbers match up, filter for it
                            .some((train_filter) => tt.train_number.startsWith(train_filter)) : true)
                        .filter((tt: any) => displayMode === "near" ? !!trainsWithHaversine[tt.train_number] : true)
                        .map((tr: any, i: number) =>
                    <TableRow
                        key={tr.train_number + "_" + tr.from + "_" + tr.to}
                        ttRow={tr}
                        serverTz={serverTz}
                        firstColRef={i === 0 ? headerFirstColRef : null}
                        secondColRef={i === 0 ? headerSecondColRef : null}
                        thirdColRef={i ===0 ? headerThirdColRef : null}
                        headerFourthColRef={i ===0 ? headerFourthColRef : null}
                        headerFifthColRef={i ===0 ? headerFifthColRef : null}
                        headerSixthhColRef={i === 0 ? headerSixthhColRef : null}
                        headerSeventhColRef={i === 0 ? headerSeventhColRef : null}
                        trainDetails={trainsWithHaversine[tr.train_number]}
                        currentTime={formatTime(dt, i18n.language)}
                        timeOffset={Math.abs((dt.getHours() * 60) + dt.getMinutes() - Number.parseInt(tr.hourSort))}
                        playSoundNotification={playSoundNotification}
                        setModalTrainId={setModalTrainId}
                    />) : <div className="w-full text-center"><Spinner /></div>
                }
            </Table.Body>
            </Table>
        </div>
        </div>
}