import React from "react";
import * as FlexLayout from "flexlayout-react";
import {useParams} from "react-router-dom";
import {getTrains, getTrainTimetable} from "../api/api";
import {Spinner} from "flowbite-react";
import {SiriusHeader} from "./Header";
import _keyBy from "lodash/keyBy";
import {TrainTimetable} from "./TrainTimetable";
import { TrainDetails } from "./TrainDetails";
import { Train } from "@simrail/types";

const fetchTrain = (trainNumber: string, serverCode: string, setTrain: (t: any) => void) => getTrains(serverCode).then((trains) => {
    const keyedTrains = _keyBy(trains, 'TrainNoLocal');
    setTrain(keyedTrains[trainNumber]);
});

const json: FlexLayout.IJsonModel = {
    global: {
        tabEnableRename: false,
        tabEnableClose: false,
    },
    borders: [],
    layout: {
        type: "row",
        id: "#2b70df36-1d90-4c03-b11c-c15a321e8b38",
        children: [
            {
                type: "row",
                id: "#1e0f0311-6f8c-4c4c-9d3b-3f26c03e2a05",
                children: [
                    {
                        type: "row",
                        id: "#3c934ab9-7fb6-44fc-aa7c-9b72a2b73402",
                        weight: 60,
                        children: [
                            {
                                type: "tabset",
                                id: "#4c934ab9-7fb6-44fc-aa7c-9b72a2b73402",
                                weight: 15,
                                children: [
                                    {
                                        type: "tab",
                                        id: "train-details-layout",
                                        name: "Train Details",
                                        component: "grid",
                                    },
                                ],
                            },
                            {
                                type: "tabset",
                                id: "#5c934ab9-7fb6-44fc-aa7c-9b72a2b73402",
                                weight: 85,
                                children: [
                                    {
                                        type: "tab",
                                        id: "timeline-layout",
                                        name: "Timeline",
                                        component: "grid",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: "tabset",
                        id: "#6c934ab9-7fb6-44fc-aa7c-9b72a2b73402",
                        weight: 40,
                        children: [
                            {
                                type: "tab",
                                id: "map-layout",
                                name: "Map",
                                component: "grid",
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

const Sirius = () => {
    const [trainTimetable, setTrainTimetable] = React.useState<any | undefined>();
    const [train, setTrain] = React.useState<Train | undefined>();
    const [model, setModel] = React.useState<FlexLayout.Model>();
    const {trainNumber, serverCode} = useParams();
    React.useEffect(() => {
        if (!trainNumber || !serverCode) return;
        getTrainTimetable(trainNumber).then(setTrainTimetable)
        fetchTrain(trainNumber, serverCode, setTrain);
        const intervalId = window.setInterval(() => {
            fetchTrain(trainNumber, serverCode, setTrain);
        }, 5000);
        return () => window.clearInterval(intervalId);
    }, [trainNumber]);

    React.useEffect(() => {
        setModel(FlexLayout.Model.fromJson(json));
    }, []);

    const factory = (node: FlexLayout.TabNode) => {
        const component = node.getId();
        if (component === "timeline-layout" && trainTimetable) {
            return (
                <TrainTimetable trainTimetable={trainTimetable} />
            );
        }
        if (component === "train-details-layout" && train) {
            return (
                <div>
                    <TrainDetails trainNumber={trainNumber} trainDetails={train} />
                </div>
            );
        }
        if (component === "map-layout") {
            return (
                <iframe src={`https://map.simrail.app/server/${serverCode}?trainId=${trainNumber}`} title="Simrail FR map embedded" className={"transition-all h-full w-full"} />
            );
        }
    };

    console.log("Train number : ", trainNumber);
    console.log("Train timetable : ", trainTimetable);
    console.log("Trains : ", train);
    return !serverCode || !trainNumber || !trainTimetable || trainTimetable.length === 0 || !train
        ? <Spinner />
        : (
            <div>
                <SiriusHeader serverCode={serverCode} trainNumber={trainNumber} trainDetails={train} />
                {model && (
                    <div className="relative h-[calc(100vh-30px)]">
                        <FlexLayout.Layout model={model} factory={factory} realtimeResize={true} />
                    </div>
                )}
            </div>
        );
}

export default Sirius;