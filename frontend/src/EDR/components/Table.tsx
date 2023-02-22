import React from "react";
import {Table, Spinner} from "flowbite-react";
import {searchSeparator} from "../../config";
import TableRow from "./TrainRow";
import useMeasure, {RectReadOnly} from "react-use-measure";
import {formatTime, nowUTC} from "../../utils/date";
import {SimRailMapModal} from "./SimRailMapModal";
import {Header} from "./Header";
import {postConfig} from "../../config/stations";
import {FilterConfig, TimeTableRow} from "..";
import { DetailedTrain } from "../functions/trainDetails";
import {format} from "date-fns";
import {TrainTimetableModal} from "./TrainTimetableModal";
import i18n from "../../i18n";

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
    serverTzOffset: number
    playSoundNotification: (callback: () => void) => void;
    post: string;
    serverCode: string;
    setGraphModalOpen: (isOpen: boolean) =>  void;
    isWebpSupported: boolean;
    filterConfig: FilterConfig;
    setFilterConfig: (newFilterConfig: FilterConfig) => void;
}

export const EDRTable: React.FC<Props> = ({
      playSoundNotification, timetable, trainsWithDetails, serverTzOffset,
      post, serverCode, setGraphModalOpen, isWebpSupported, filterConfig, setFilterConfig
    }) => {
    const [displayMode, setDisplayMode] = React.useState<string>("all");
    const [filter, setFilter] = React.useState<string | undefined>();
    const [mapModalTrainId, setMapModalTrainId] = React.useState<string | undefined>();
    const [timetableModalTrainId, setTimetableModalTrainId] = React.useState<string | undefined>();
    const [streamMode, setStreamMode] = React.useState(false);

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

    const dt = nowUTC(serverTzOffset);

    if (!trainsWithDetails || !post) return null;
    const postCfg = postConfig[post];
    const showStopColumn = timetable.length > 0 && timetable.some((row: any) => row.platform || Math.ceil(parseInt(row.layover)) !== 0);

    const getTimetableStartingFromHour = (timetable: TimeTableRow[], startHour: string) => {      
        // Find the index of the first time in the timetable that is equal to or
        // greater than the start hour
        const startIndex = timetable.findIndex((time: TimeTableRow) => time.scheduled_arrival >= startHour);
        
        if (startIndex === -1) {
          // If there is no time in the timetable that is equal to or greater than the
          // start hour, add the times from the beginning of the 24-hour period up to
          // (but not including) the start hour, as well as all times from the start
          // hour until the end of the 24-hour period
            return [
                ...timetable.slice(0, timetable.findIndex((time: TimeTableRow) => time.scheduled_arrival === startHour)),
                ...timetable.slice(timetable.findIndex((time: TimeTableRow) => time.scheduled_arrival === startHour))
            ];
        } else {
          // If there is a time in the timetable that is equal to or greater than the
          // start hour, return a new array that starts from the start index and
          // includes all times up to the end of the 24-hour period, as well as all
          // times from the beginning of the 24-hour period up to (but not including)
          // the start index
            return [
                ...timetable.slice(startIndex),
                ...timetable.slice(0, startIndex)
            ];
        }
    }

    return <div>
        <SimRailMapModal serverCode={serverCode} trainId={mapModalTrainId} setModalTrainId={setMapModalTrainId} />
        <TrainTimetableModal trainId={timetableModalTrainId} setModalTrainId={setTimetableModalTrainId} />
        <Header
            serverTzOffset={serverTzOffset}
            serverCode={serverCode}
            postCfg={postCfg}
            bounds={{...bounds, showStopColumn}}
            timetableLength={timetable.length}
            setFilter={setFilter}
            setGraphModalOpen={setGraphModalOpen}
            streamMode={streamMode}
            setStreamMode={setStreamMode}
            filterConfig={filterConfig}
            setFilterConfig={setFilterConfig}
        />
        <div>
            <Table striped={true}>
            <Table.Body className="overflow-x-auto">
                {timetable.length > 0
                    ? getTimetableStartingFromHour(
                        timetable,
                        formatTime(nowUTC(serverTzOffset, 1), i18n.language, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }))
                        .filter((tt) => filter ? 
                            // Remove spaces, trim not enough since humans usually use space after a separator
                            filter.replace(/\s+/g, '')
                            // Separate train numbers
                            .split(searchSeparator)
                            // Remove empty values (if last char is separator, no filtering would occur due to empty string)
                            .filter(n => n)
                            // If any train numbers match up, filter for it
                            .some((train_filter) => tt.train_number.startsWith(train_filter)) : true)
                        .filter((tt) => filterConfig.onlyOnTrack ? !!trainsWithDetails[tt.train_number] : true)
                        .map((tr) =>
                    <TableRow
                        key={tr.train_number + "_" + tr.from + "_" + tr.to}
                        ttRow={tr}
                        serverTzOffset={serverTzOffset}
                        post={post}
                        firstColRef={ headerFirstColRef}
                        secondColRef={headerSecondColRef}
                        thirdColRef={headerThirdColRef}
                        headerFourthColRef={headerFourthColRef}
                        headerFifthColRef={headerFifthColRef}
                        headerSixthhColRef={headerSixthhColRef}
                        headerSeventhColRef={headerSeventhColRef}
                        trainDetails={trainsWithDetails[tr.train_number]}
                        timeOffset={Math.abs(Number.parseInt(format(dt, "HHmm")) - tr.hourSort)}
                        playSoundNotification={playSoundNotification}
                        setModalTrainId={setMapModalTrainId}
                        setTimetableTrainId={setTimetableModalTrainId}
                        isWebpSupported={isWebpSupported}
                        showOnlyApproachingTrains={displayMode === "approaching"}
                        streamMode={streamMode}
                        filterConfig={filterConfig}
                    />) : <div className="w-full text-center"><Spinner /></div>
                }
            </Table.Body>
            </Table>
        </div>
        </div>
}