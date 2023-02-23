import React from "react";
import {useParams} from "react-router-dom";
import {getTrains, getTrainTimetable} from "../api/api";
import {Spinner} from "flowbite-react";
import {SiriusHeader} from "./Header";
import _keyBy from "lodash/keyBy";
import {TrainTimetable} from "./TrainTimetable";

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
        : <div>
            <SiriusHeader serverCode={serverCode} trainNumber={trainNumber} trainDetails={train}/>
            <TrainTimetable trainTimetable={trainTimetable}/>
            <iframe src={`https://map.simrail.app/server/${serverCode}?trainId=${trainNumber}`} title="Simrail FR map embedded" className={"h-[40vh] w-full"}/>
        </div>
        ;
}

export default Sirius;
