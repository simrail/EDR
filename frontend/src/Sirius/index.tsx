import React from "react";
import {useParams} from "react-router-dom";
import {getTrains, getTrainTimetable} from "../api/api";
import {Spinner} from "flowbite-react";
import {SiriusHeader} from "./Header";
import _keyBy from "lodash/keyBy";
import {TrainTimetable} from "./TrainTimetable";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

const fetchTrain = (trainNumber: string, serverCode: string, setTrain: (t: any) => void) => getTrains(serverCode).then((trains) => {
    const keyedTrains = _keyBy(trains, 'TrainNoLocal');
    setTrain(keyedTrains[trainNumber]);
});

const Sirius = () => {
    const [trainTimetable, setTrainTimetable] = React.useState<any | undefined>();
    const [train, setTrain] = React.useState<any | undefined>();
    const {trainNumber, serverCode} = useParams();
    React.useEffect(() => {
        if (!trainNumber || !serverCode) return;
        getTrainTimetable(trainNumber).then(setTrainTimetable)
        fetchTrain(trainNumber, serverCode, setTrain);
        const intervalId = window.setInterval(() => {
            fetchTrain(trainNumber, serverCode, setTrain);
        }, 5000);
        return () => window.clearInterval(intervalId);
    }, [trainNumber])
    console.log("Train number : ", trainNumber);
    console.log("Train timetable : ", trainTimetable);
    console.log("Trains : ", train);
    return !serverCode || !trainNumber || !trainTimetable || trainTimetable.length === 0 || !train
        ? <Spinner />
        : (
            <div className="h-[calc(100vh-30px)]">
                {/* autoSaveId="persistence" */}
                <SiriusHeader serverCode={serverCode} trainNumber={trainNumber} trainDetails={train} />
                <PanelGroup direction="vertical" disablePointerEventsDuringResize={true}>
                    <Panel defaultSize={60} maxSize={75} className="transition ease-out">
                        <TrainTimetable trainTimetable={trainTimetable} />
                    </Panel>
                    <PanelResizeHandle className="w-full">
                        <div className="transition mx-2 bg-slate-50 w-full flex justify-center rounded-lg text-slate-800 hover:bg-slate-100 active:bg-slate-400 active:text-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 dark:active:bg-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M11.47 4.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 01-1.06 1.06L12 6.31 8.78 9.53a.75.75 0 01-1.06-1.06l3.75-3.75zm-3.75 9.75a.75.75 0 011.06 0L12 17.69l3.22-3.22a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 010-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </PanelResizeHandle>
                    <Panel defaultSize={40} maxSize={75} className="transition ease-out">
                        <iframe src={`https://map.simrail.app/server/${serverCode}?trainId=${trainNumber}`} title="Simrail FR map embedded" className={"transition-all h-full w-full"} />
                    </Panel>
                </PanelGroup>
            </div>
        );
}

export default Sirius;
