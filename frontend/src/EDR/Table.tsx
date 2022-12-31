import React from "react";
import {Table, TextInput, Label, Button, Checkbox, Spinner, DarkThemeToggle} from "flowbite-react";
import {IconByType} from "./config";
import _ from "lodash/fp";

const TableHead = () => {
    return <Table.Row>
        <Table.HeadCell>
            N°
        </Table.HeadCell>
        <Table.HeadCell>
            Type
        </Table.HeadCell>
        <Table.HeadCell>
            Heure arrivée
        </Table.HeadCell>
        <Table.HeadCell>
            Provenance
        </Table.HeadCell>
        <Table.HeadCell>
            Stop
        </Table.HeadCell>
        <Table.HeadCell>
            Heure depart
        </Table.HeadCell>
        <Table.HeadCell>
            Destination
        </Table.HeadCell>
        <Table.HeadCell>
            Ligne
        </Table.HeadCell>
        <Table.HeadCell>
            Traité
        </Table.HeadCell>
    </Table.Row>;
}

const TableRow: React.FC<any> = ({ttRow, timeOffset}) => {
    const [isDone, setIsDone] = React.useState(false);
    const trainIcon = IconByType[ttRow.type as string];
    return <Table.Row className="cursor-pointer" style={{opacity: isDone ? 0.3 : 1}} data-timeoffset={timeOffset}>
        <Table.Cell>
            <div className="flex items-center justify-between">
            {ttRow.train_number}{trainIcon && <img src={trainIcon} height={50} width={64}/>}
            </div>
        </Table.Cell>
        <Table.Cell>
            {ttRow.type} {ttRow.type_speed}km/h
        </Table.Cell>
        <Table.Cell>
            {ttRow.scheduled_arrival}
        </Table.Cell>
        <Table.Cell>
            {ttRow.from}
        </Table.Cell>
        <Table.Cell>
            {ttRow.layover} {ttRow.stop_type} {ttRow.platform && <>({ttRow.platform})</>}
        </Table.Cell>
        <Table.Cell>
            {ttRow.scheduled_departure}
        </Table.Cell>
        <Table.Cell>
            {ttRow.to}
        </Table.Cell>
        <Table.Cell>
            {ttRow.line}
        </Table.Cell>
        <Table.Cell>
            <Checkbox onChange={() => setIsDone(!isDone)}/>
        </Table.Cell>
    </Table.Row>
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
        console.log(allTrainRows.length);
        if (allTrainRows.length === 0 && allTrainRows.length === targetLn)
            return;
        clearInterval(interval);
        const el: any = _.sortBy(([idx, el]) => {
            return el.getAttribute("data-timeoffset")
            }
        , allTrainRows);

        console.log(el[0]);
        el[0][1].scrollIntoView({
            behavior: "smooth",
            block: "center"
        })
    }, 200);
}

export const EDRTable: React.FC<any> = ({timetable}) => {
    const [filter, setFilter] = React.useState<string | undefined>();
    const [displayingRows, setDisplayingRows] = React.useState<any[]>([]);

    const dt = new Date(Date.now());
    const dtString = `${dt.getHours()}${dt.getMinutes()}`
    console.log(dtString);

    React.useEffect(() => {
        setDisplayingRows(timetable
            .filter((tt: any) => filter ? tt.train_number.startsWith(filter): true));
        scrollToNearestTrain(displayingRows.length);
    }, [filter]);


    return <div>
        <div style={{position: "sticky", top: 0, zIndex: 99999}} className="w-[50vw] bg-inherit">
            <div >
                <DateTimeDisplay />
                <DarkThemeToggle/>
            </div>
            <div className="w-full">
            <Label htmlFor="trainNumberFilter">N° de train</Label>
            <TextInput id="trainNumberFilter" className="mb-2" onChange={(e) => setFilter(e.target.value)} />
                <Button onClick={() => scrollToNearestTrain(displayingRows.length)}>Trains proches</Button>
            </div>
        </div>
        <div>
            <Table striped={true}>
            <TableHead />
            <Table.Body>
                {displayingRows.length > 0
                    ? displayingRows.map((tr: any) =>
                    <TableRow
                        key={tr.train_number}
                        ttRow={tr}
                        timeOffset={Math.abs((dt.getHours() * 60) + dt.getMinutes() - Number.parseInt(tr.hourSort))}
                    />) : <div className="text-center w-full"><Spinner /></div>
                }
            </Table.Body>
            </Table>
        </div>
        </div>
}