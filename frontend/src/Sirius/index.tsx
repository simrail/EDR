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

export type TrainTimeTableRow = {
    indexOfPoint: number,
	nameForPerson: string,
	pointId: string,
	displayedTrainNumber: string,
	arrivalTime: string | null,
	actualArrivalTime: string | null,
	departureTime: string | null,
	actualDepartureTime: string | null,
	isStoped: boolean,
	stopDuration: number,
	isActive: boolean,
	isConfirmed: boolean,
	confirmedBy: number,
	plannedStop: number,
	timetableType: number,
    stopTypeNumber: number,
	leftTrack: boolean,
	line: number,
	platform: string | null,
	track: number | null,
	trainType: string,
	mileage: number,
	maxSpeed: number,
    actualArrivalObject: Date,
    actualDepartureObject: Date,
    scheduledArrivalObject: Date,
    scheduledDepartureObject: Date,
    speedLimitsToNextStation: [{
        lineNo: string,
        axisStart: number,
        axisEnd: number,
        vMax: string,
        track: string
    }]
};

const fetchTrain = (trainNumber: string, serverCode: string, setTrain: (t: Train) => void) => getTrains(serverCode).then((trains) => {
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

type Props = {
    isWebpSupported: boolean,
}

const Sirius: React.FC<Props> = ({isWebpSupported}) => {
    const [autoScroll, setAutoScroll] = React.useState(true);
    const [showSpeedLimits, setShowSpeedLimits] = React.useState(false);
    const [serverTzOffset, setServerTzOffset] = React.useState<number>();
    const [trainTimetable, setTrainTimetable] = React.useState<TrainTimeTableRow[] | undefined>();
    const [train, setTrain] = React.useState<Train | undefined>();
    const [model, setModel] = React.useState<FlexLayout.Model>();
    const [allStationsInPath, setAllStationsInPath] = React.useState<StationConfig[] | undefined>();
    const {trainNumber, serverCode} = useParams();
    React.useEffect(() => {
        if (!trainNumber || !serverCode) return;
        getTrainTimetable(trainNumber, serverCode).then(setTrainTimetable);
        getTzOffset(serverCode).then(setServerTzOffset)
        fetchTrain(trainNumber, serverCode, setTrain);
        const intervalId = window.setInterval(() => {
            fetchTrain(trainNumber, serverCode, setTrain);
        }, 10000);
        return () => window.clearInterval(intervalId);
    }, [trainNumber, serverCode]);

    React.useEffect(() => {
        if (!trainTimetable) return;
        const allStationsInPath = trainTimetable
            .map((ttRow) => ttRow.nameForPerson)
            .map((stationName) => postToInternalIds[encodeURIComponent(stationName)])
            .filter((sc) => !!sc)
            .map((sc) => postConfig[sc.id])
        setAllStationsInPath(allStationsInPath);

    }, [trainTimetable]);

    React.useEffect(() => {
        resetLayout();
    }, []);
    
    const resetLayout = () => {
        setModel(FlexLayout.Model.fromJson(driverViewLayout));
    };

    const factory = (node: FlexLayout.TabNode) => {
        const component = node.getId();
        if (component === "timeline-layout" && trainTimetable && train && allStationsInPath) {
            return (
                <TrainTimetable
                    autoScroll={autoScroll}
                    trainTimetable={trainTimetable}
                    train={train}
                    allStationsInpath={allStationsInPath}
                    isWebpSupported={isWebpSupported}
                    serverCode={serverCode}
                    showSpeedLimits={showSpeedLimits}
                />
            );
        }
        if (component === "train-details-layout" && train && trainTimetable) {
            return (
                <div>
                    <TrainDetails trainNumber={trainNumber} trainDetails={train} trainTimeTable={trainTimetable} />
                </div>
            );
        }
        if (component === "map-layout") {
            return (
                <iframe src={`https://map.simrail.app/server/${serverCode}?trainId=${trainNumber}`} title="Simrail FR map embedded" className={"transition-all h-full w-full"} />
            );
        }
    };

    return !serverCode || !trainNumber || !trainTimetable || trainTimetable.length === 0 || !train || serverTzOffset === undefined
        ? (
            <div className="h-screen w-screen flex justify-center items-center">
                <Spinner size="xl" />
            </div>
        )
        : (
            <div>
                <SiriusHeader resetLayout={resetLayout} autoScroll={autoScroll} setAutoScroll={setAutoScroll} setShowSpeedLimits={setShowSpeedLimits} showSpeedLimits={showSpeedLimits} serverCode={serverCode} trainNumber={trainNumber} trainDetails={train} serverTzOffset={serverTzOffset} />
                {model && (
                    <div className="relative h-[calc(100vh-40px)]">
                        <FlexLayout.Layout model={model} factory={factory} realtimeResize={true} />
                    </div>
                )}
            </div>
        );
}

export default Sirius;
