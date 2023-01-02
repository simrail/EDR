import React from "react";
import {Table, TextInput, Label, Button, Checkbox, Spinner, DarkThemeToggle, Badge} from "flowbite-react";
import {configByType} from "./config";
import _ from "lodash/fp";
import {TableRow} from "./TrainRow";
import {StringParam, useQueryParam} from "use-query-params";
import {useTranslation} from "react-i18next";

const TableHead = () => {
    const {t} = useTranslation();
    return <Table.Row>
        <Table.HeadCell>
            {t('edr.train_headers.train_number')}
        </Table.HeadCell>
        <Table.HeadCell>
            {t('edr.train_headers.train_type')}
        </Table.HeadCell>
        <Table.HeadCell>
            {t('edr.train_headers.train_arrival_time')}
        </Table.HeadCell>
        <Table.HeadCell>
            {t('edr.train_headers.train_from')}
        </Table.HeadCell>
        <Table.HeadCell>
            {t('edr.train_headers.train_stop')}
        </Table.HeadCell>
        <Table.HeadCell>
            {t('edr.train_headers.train_departure_time')}
        </Table.HeadCell>
        <Table.HeadCell>
            {t('edr.train_headers.train_to')}
        </Table.HeadCell>
    </Table.Row>;
}

const DateTimeDisplay = () => {
    // TODO: Take server TZ
    const [dt, setDt] = React.useState(new Date(Date.now()));

    React.useEffect(() => {
        setInterval(() => {
            setDt(new Date(Date.now()));
        }, 1000)
    }, [])

    return <>
        {dt.getHours()}:{dt.getMinutes()}:{dt.getSeconds()}
    </>
}

const scrollToNearestTrain = (targetLn: number) => {
    let interval = setInterval(() => {
        const allTrainRows = [...Array.from(document.querySelectorAll('[data-timeoffset]').entries())];
        // console.log(allTrainRows.length);
        if (allTrainRows.length === 0 && allTrainRows.length === targetLn)
            return;
        clearInterval(interval);
        const el: any = _.sortBy(([idx, el]) => {
            return el.getAttribute("data-timeoffset")
            }
        , allTrainRows);

        // console.log(el[0]);
        el[0][1].scrollIntoView({
            block: "center"
        })
    }, 200);
}

export const EDRTable: React.FC<any> = ({timetable, trainsWithHaversine}) => {
    const [displayMode, setDisplayMode] = React.useState<string>("all");
    const [filter, setFilter] = React.useState<string | undefined>();
    const [displayingRows, setDisplayingRows] = React.useState<any[]>([]);
    const {t} = useTranslation();

    const dt = new Date(Date.now());
    const dtString = `${dt.getHours()}${dt.getMinutes()}`
    const [betaToken] = useQueryParam('betaToken', StringParam);
    // console.log(dtString);

    React.useEffect(() => {
        setDisplayingRows(timetable
            .filter((tt: any) => filter ? tt.train_number.startsWith(filter): true)
            .filter((tt: any) => displayMode === "near" ? !!trainsWithHaversine[tt.train_number] : true))

        if (displayMode === "all" && !filter)
            setTimeout(() => scrollToNearestTrain(displayingRows.length), 1000, displayingRows.length);
    }, [filter, displayMode]);

    // TODO: This introduces a bug ! It makes the filter jump
     React.useEffect(() => {
        const interval = setInterval(() => {
            if (displayMode !== "near") return;
            setDisplayingRows(timetable
                .filter((tt: any) => displayMode === "near" ? !!trainsWithHaversine[tt.train_number] : true))

        }, 2000, displayMode);

        return () => window.clearInterval(interval);
     }, [displayMode]);

    // console.log("All trains : ", timetable);
    // console.log("Displayed trains : ", displayingRows);

    if (!trainsWithHaversine) return null;


    return <div>
        <div style={{position: "sticky", top: 0, zIndex: 99999}} className="w-full bg-white dark:bg-slate-800">
            <div className="flex justify-between items-center px-4">
                <div>
                    <a href={`/?betaToken=${betaToken}`} className="underline">{t('edr.ui.close') ?? ''} ❌</a>
                </div>
                <DateTimeDisplay />
                <div className="flex items-center">
                    <>{t('edr.ui.dark_light_mode_switch') ?? ''} :&nbsp;</>
                    <DarkThemeToggle/>
                </div>
            </div>
            <div className="w-full flex items-center px-4 mt-2">
                <TextInput id="trainNumberFilter" className="mb-2 w-full" onChange={(e) => setFilter(e.target.value)} placeholder={t('edr.ui.train_number') ?? ''}/>
                <Button color={displayMode !== "all" ? "default" : undefined} onClick={() => { setDisplayMode("all"); scrollToNearestTrain(displayingRows.length); }}>{t('edr.ui.filter_train_all') ?? ''}</Button>
                <Button color={displayMode !== "near" ? "default" : undefined} onClick={() => setDisplayMode("near")}>{t('edr.ui.filter_train_online') ?? ''}</Button>
            </div>
        </div>
        <div>
            <Table striped={true}>
            <TableHead />
            <Table.Body>
                {displayingRows.length > 0
                    ? displayingRows.map((tr: any) =>
                    <TableRow
                        key={tr.train_number + "_" + tr.from + "_" + tr.to}
                        ttRow={tr}
                        trainDetails={trainsWithHaversine[tr.train_number]}
                        currentTime={dt}
                        timeOffset={Math.abs((dt.getHours() * 60) + dt.getMinutes() - Number.parseInt(tr.hourSort))}
                    />) : <div className="text-center w-full"><Spinner /></div>
                }
            </Table.Body>
            </Table>
        </div>
        </div>
}