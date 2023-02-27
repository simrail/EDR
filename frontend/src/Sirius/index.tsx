import React from "react";
import * as FlexLayout from "flexlayout-react";
import {useParams} from "react-router-dom";
import {getTrains, getTrainTimetable, getTzOffset} from "../api/api";
import {Spinner} from "flowbite-react";
import {SiriusHeader} from "./Header";
import _keyBy from "lodash/keyBy";
import {TrainTimetable} from "./TrainTimetable";
import { TrainDetails } from "./TrainDetails";
import { Train } from "@simrail/types";
import {postConfig, postToInternalIds, StationConfig} from "../config/stations";

const fetchTrain = (trainNumber: string, serverCode: string, setTrain: (t: any) => void) => getTrains(serverCode).then((trains) => {
    const keyedTrains = _keyBy(trains, 'TrainNoLocal');
    setTrain(keyedTrains[trainNumber]);
});

const driverViewLayout: FlexLayout.IJsonModel = {
    global: {
        tabEnableRename: false,
        tabEnableFloat: true,
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
                                        enableClose: true,
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
                                        enableClose: false,
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
                                enableClose: false,
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

const Sirius = () => {
    const [autoScroll, setAutoScroll] = React.useState(true);
    const [serverTzOffset, setServerTzOffset] = React.useState<number>();
    const [trainTimetable, setTrainTimetable] = React.useState<any | undefined>();
    const [train, setTrain] = React.useState<Train | undefined>();
    const [model, setModel] = React.useState<FlexLayout.Model>();
    const [allStationsInPath, setAllStationsInPath] = React.useState<StationConfig[] | undefined>();
    const {trainNumber, serverCode} = useParams();
    React.useEffect(() => {
        if (!trainNumber || !serverCode) return;
        getTrainTimetable(trainNumber).then(setTrainTimetable);
        getTzOffset(serverCode).then(setServerTzOffset)
        fetchTrain(trainNumber, serverCode, setTrain);
        const intervalId = window.setInterval(() => {
            fetchTrain(trainNumber, serverCode, setTrain);
        }, 5000);
        return () => window.clearInterval(intervalId);
    }, [trainNumber, serverCode]);

    React.useEffect(() => {
        if (!trainTimetable) return;
        const allStationsInPath = trainTimetable
            .map((ttRow: any) => ttRow.station)
            .map((stationName: string) => postToInternalIds[encodeURIComponent(stationName)])
            .filter((sc: any) => !!sc)
            .map((sc: any) => postConfig[sc.id])
        setAllStationsInPath(allStationsInPath);

    }, [trainTimetable]);

    React.useEffect(() => {
        resetLayout();
    }, []);
    
    const resetLayout = () => {
        setModel(FlexLayout.Model.fromJson(driverViewLayout));
    };

    console.log("Server Tz offset : ", serverTzOffset);
    const factory = (node: FlexLayout.TabNode) => {
        const component = node.getId();
        if (component === "timeline-layout" && trainTimetable && train && allStationsInPath) {
            return (
                <TrainTimetable autoScroll={autoScroll} trainTimetable={trainTimetable} train={train} allStationsInpath={allStationsInPath}/>
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
    return !serverCode || !trainNumber || !trainTimetable || trainTimetable.length === 0 || !train || !serverTzOffset
        ? (
            <div className="h-screen w-screen flex justify-center items-center">
                <Spinner size="xl" />
            </div>
        )
        : (
            <div>
                <SiriusHeader resetLayout={resetLayout} autoScroll={autoScroll} setAutoScroll={setAutoScroll} serverCode={serverCode} trainNumber={trainNumber} trainDetails={train} serverTzOffset={serverTzOffset} />
                {model && (
                    <div className="relative h-[calc(100vh-40px)]">
                        <FlexLayout.Layout model={model} factory={factory} realtimeResize={true} />
                    </div>
                )}
            </div>
        );
}

export default Sirius;
