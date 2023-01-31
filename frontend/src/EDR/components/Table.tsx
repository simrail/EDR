import React from "react";
import {Table, Spinner} from "flowbite-react";
import {searchSeparator} from "../../config";
import TableRow from "./TrainRow";
import useMeasure, {RectReadOnly} from "react-use-measure";
import {nowUTC} from "../../utils/date";
import {SimRailMapModal} from "./SimRailMapModal";
import {Header} from "./Header";
import {postConfig} from "../../config/stations";
import { TimeTableRow } from "..";
import { DetailedTrain } from "../functions/trainDetails";

export type Bounds = {
    firstColBounds: RectReadOnly;
    secondColBounds: RectReadOnly;
    thirdColBounds: RectReadOnly;
    fourthColBounds: RectReadOnly;
    fifthColBounds: RectReadOnly;
    sixthColBounds: RectReadOnly;
    seventhColBounds: RectReadOnly;
    showStopColumn: boolean;
}

type Props = {
    timetable: TimeTableRow[];
    trainsWithDetails: {[k: string]: DetailedTrain};
    serverTz: string
    playSoundNotification: (callback: () => void) => void;
    post: string;
    serverCode: string;
}

export const EDRTable: React.FC<Props> = ({playSoundNotification, timetable, trainsWithDetails, serverTz, post, serverCode}) => {
    const [displayMode, setDisplayMode] = React.useState<string>("all");
    const [filter, setFilter] = React.useState<string | undefined>();
    const [modalTrainId, setModalTrainId] = React.useState<string | undefined>();

    const [headerFirstColRef, firstColBounds] = useMeasure();
    const [headerSecondColRef, secondColBounds] = useMeasure();
    const [headerThirdColRef, thirdColBounds] = useMeasure();
    const [headerFourthColRef, fourthColBounds] = useMeasure();
    const [headerFifthColRef, fifthColBounds] = useMeasure();
    const [headerSixthhColRef, sixthColBounds] = useMeasure();
    const [headerSeventhColRef, seventhColBounds] = useMeasure();

    const bounds = {
        firstColBounds,
        secondColBounds,
        thirdColBounds,
        fourthColBounds,
        fifthColBounds,
        sixthColBounds,
        seventhColBounds
    }

    const dt = nowUTC(serverTz);


    if (!trainsWithDetails || !post) return null;
    const postCfg = postConfig[post];
    const showStopColumn = timetable.length > 0 && timetable.some((row: any) => row.platform || Math.ceil(parseInt(row.layover)) !== 0);

    return <div>
        <SimRailMapModal serverCode={serverCode} trainId={modalTrainId} setModalTrainId={setModalTrainId} />
        <Header
            serverTz={serverTz}
            serverCode={serverCode}
            postCfg={postCfg}
            displayMode={displayMode}
            bounds={{...bounds, showStopColumn}}
            timetableLength={timetable.length}
            setFilter={setFilter}
            setDisplayMode={setDisplayMode}
        />
        <div>
            <Table striped={true}>
            <Table.Body>
                {timetable.length > 0
                    ? timetable
                        .filter((tt) => filter ? 
                            // Remove spaces, trim not enough since humans usually use space after a separator
                            filter.replace(/\s+/g, '')
                            // Separate train numbers
                            .split(searchSeparator)
                            // Remove empty values (if last char is separator, no filtering would occur due to empty string)
                            .filter(n => n)
                            // If any train numbers match up, filter for it
                            .some((train_filter) => tt.train_number.startsWith(train_filter)) : true)
                        .filter((tt) => displayMode === "near" ? !!trainsWithDetails[tt.train_number] : true)
                        .map((tr, i: number) =>
                    <TableRow
                        key={tr.train_number + "_" + tr.from + "_" + tr.to}
                        ttRow={tr}
                        serverTz={serverTz}
                        post={post}
                        firstColRef={i === 0 ? headerFirstColRef : null}
                        secondColRef={i === 0 ? headerSecondColRef : null}
                        thirdColRef={i ===0 ? headerThirdColRef : null}
                        headerFourthColRef={i ===0 ? headerFourthColRef : null}
                        headerFifthColRef={i ===0 ? headerFifthColRef : null}
                        headerSixthhColRef={i === 0 ? headerSixthhColRef : null}
                        headerSeventhColRef={i === 0 ? headerSeventhColRef : null}
                        trainDetails={trainsWithDetails[tr.train_number]}
                        timeOffset={Math.abs((dt.getHours() * 100) + dt.getMinutes() - tr.hourSort)}
                        playSoundNotification={playSoundNotification}
                        setModalTrainId={setModalTrainId}
                    />) : <div className="w-full text-center"><Spinner /></div>
                }
            </Table.Body>
            </Table>
        </div>
        </div>
}