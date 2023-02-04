import React from "react";
import {TimeTableRow} from "../../index";
import {nowUTC} from "../../../utils/date";
import {getTimetable} from "../../../api/api";
import _keyBy from "lodash/keyBy";
import {postConfig, postToInternalIds} from "../../../config/stations";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import {configByType} from "../../../config/trains";
import {format} from "date-fns";
import {getDateWithHourAndMinutes} from "../../functions/timeUtils";
import {PathFinding_FindPathAndHaversineSum, PathFindingLineTrace} from "../../../pathfinding/api";
import _sortBy from "lodash/sortBy";
import {LayoutType} from "recharts/types/util/types";
import {Button} from "flowbite-react";

export type GraphProps = {
    post: string;
    timetable: TimeTableRow[];
    serverTz: string;
}

const dateFormatter = (date: Date) => {
    return format(date, "HH:mm");
};
const makeDate = (dateAry: [string, string], serverTz: string) => {
    const dateNow = nowUTC(serverTz);
    const hours = Number.parseInt(dateAry[0]);
    const minutes = Number.parseInt(dateAry[1]);
    const isDepartureNextDay = dateNow.getHours() >= 20 && Number.parseInt(dateAry[0]) < 12;  // TODO: less but still clunky
    const isDeparturePreviousDay = Number.parseInt(dateAry[0]) >= 20 && dateNow.getHours() < 12; // TODO: less but still Clunky
    const date =  getDateWithHourAndMinutes(dateNow, hours, minutes, isDepartureNextDay, isDeparturePreviousDay);
    return date.getTime();
}

const getStationTimetable = (postId: string) => {
    return getTimetable(postId).then((d) => [postId, _keyBy(d, "train_number")]);
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip p-2 flex flex-col bg-white">
                <span>{label}</span>
                {_sortBy(payload, 'value').map((p: any) => {
                    return (
                        <div className="flex justify-between w-full" key={p.dataKey}>
                            <span style={{color: p.stroke}}>{p.dataKey}&nbsp;&nbsp;</span><span>{format(new Date(p.value), "HH:mm")}</span>
                        </div>
                    )
                })}
            </div>
        );
    }

    return null;
}

// TODO: This code is WET and have been written in an envening. Neeeeds refactoring of course ! (so it can be DRY :D)
const GraphContent: React.FC<GraphProps> = ({timetable, post, serverTz}) => {
    const [displayMode, setDisplayMode] = React.useState<LayoutType>("vertical");
    const [zoom, setZoom] = React.useState<number>(1);
    const [dtNow, setDtNow] = React.useState(nowUTC(serverTz));
    const currentHourSort = Number.parseInt(format(dtNow, "HHmm"));
    const [neighboursTimetables, setNeighboursTimetables] = React.useState<any>();
    const [allPathsOfPosts, setAllPathsOfPosts] = React.useState<{[postId: string]: {prev?: PathFindingLineTrace, next?: PathFindingLineTrace}}>();
    const [data, setData] = React.useState<any[]>();
    const onlyAnHourAround = React.useMemo(
        () => _keyBy(timetable.filter((ttRow) =>
            Math.abs(ttRow.hourSort - currentHourSort) <= 130 / zoom), "train_number"),
        [currentHourSort, timetable, zoom]);
    // console.log("Current hour sort : ", currentHourSort);

    React.useEffect(() => {
        const intervalId = window.setInterval(() => {
            setDtNow(nowUTC(serverTz));
        }, 10000);

        return () => window.clearInterval(intervalId);
    }, [])

    React.useEffect(() => {
        const gottenPostConfig = postConfig[post];
        if (!post || !gottenPostConfig.graphConfig?.pre || !gottenPostConfig.graphConfig?.post) return;
        const onScreenPosts = [...gottenPostConfig.graphConfig?.pre, ...gottenPostConfig.graphConfig.post];
        const toCalculatePathPosts = [...gottenPostConfig.graphConfig?.pre, post, ...gottenPostConfig.graphConfig.post, ...gottenPostConfig.graphConfig.final];
        // Get all pathfinding possible paths between two stations (with intermediate stations not dispatched by players)
        const allPaths = toCalculatePathPosts.reduce((acc, val, index) => {
            const maybeLineTraceAndDistancePrevious = index > 0
                ? PathFinding_FindPathAndHaversineSum(toCalculatePathPosts[index - 1], toCalculatePathPosts[index])
                : undefined;
            const maybeLineTraceAndDistanceNext = index < toCalculatePathPosts.length - 1
                ? PathFinding_FindPathAndHaversineSum(toCalculatePathPosts[index], toCalculatePathPosts[index + 1])
                : undefined;

            return {
                ...acc,
                [val]: {
                    prev: maybeLineTraceAndDistancePrevious?.[0],
                    next: maybeLineTraceAndDistanceNext?.[0]
                }
            }
        }, {});

        setAllPathsOfPosts(allPaths);

        // Get timetable data
        Promise.all(onScreenPosts.map(getStationTimetable))
            .then(Object.fromEntries)
            .then(setNeighboursTimetables)
    }, [post]);

    React.useEffect(() => {
        if (!neighboursTimetables || !onlyAnHourAround || !allPathsOfPosts) return;
        // console.log("Around DT", onlyAnHourAround);
        const gottenPostConfig = postConfig[post];
        if (!gottenPostConfig.graphConfig?.pre || !gottenPostConfig.graphConfig?.post) return;
        // console.log(neighboursTimetables)

        const postsToScan = [...gottenPostConfig.graphConfig!.pre, post, ...gottenPostConfig.graphConfig!.post];
        const data = postsToScan.flatMap((postId, postIdx) => {
            const allTrainDepartures = Object.fromEntries(Object.values(onlyAnHourAround).map((t) => {
                const targetTrain = postId === post ? t : neighboursTimetables[postId]?.[t.train_number];
                // console.log("tt", targetTrain);
                if (!targetTrain) return [];
                const nextPost = postToInternalIds[encodeURIComponent(targetTrain.to)]?.id;
                // console.log("Next post: ", nextPost);
                if (!nextPost) return []
                const isTrainGoingToKatowice = !!allPathsOfPosts[postId]?.next?.find((station) => station && station?.id === nextPost)
                const targetValue = isTrainGoingToKatowice ? targetTrain?.scheduled_departure : targetTrain?.scheduled_arrival;
                return [targetTrain.train_number, makeDate(targetValue.split(":"), serverTz)]
            }))
            const allTrainArrivals = Object.fromEntries(Object.values(onlyAnHourAround).map((t) => {
                const targetTrain = postId === post ? t : neighboursTimetables[postId]?.[t.train_number];
                // console.log("tt", targetTrain);
                if (!targetTrain) return [];
                const nextPost = postToInternalIds[encodeURIComponent(targetTrain.to)]?.id;
                // console.log("Next post: ", nextPost);
                if (!targetTrain || !nextPost) return [];
                const isTrainGoingToKatowice = !!allPathsOfPosts[postId]?.next?.find((station) => station && station?.id === nextPost)
                // console.log("ITGTK ", isTrainGoingToKatowice);
                const targetValue = isTrainGoingToKatowice ? targetTrain?.scheduled_arrival : targetTrain?.scheduled_departure;
                return [targetTrain.train_number, makeDate(targetValue.split(":"), serverTz)]
            }))
            // console.log("All train departures : ", allTrainDepartures);
            return [{
                name: postId,
                ...allTrainArrivals
            }, {
                name: postId,
                ...allTrainDepartures
            }]
        });

        // console.log("Final data : ", data);
        setData(data);
    }, [neighboursTimetables, onlyAnHourAround, currentHourSort, post, serverTz, allPathsOfPosts])

    const TimeComponent = displayMode === "vertical" ? XAxis : YAxis;
    const PostComponent = displayMode === "vertical" ? YAxis : XAxis;

    return (
            <>
                <div className="text-center inline-flex items-center justify-center w-full">
                    This graph shows scheduled departure and arrival
                    <Button className="ml-4" size={'xs'} onClick={() => setDisplayMode(displayMode === "vertical" ? "horizontal" : "vertical")}>Switch axis</Button>
                    <div className="inline-flex ml-8 items-center">
                        <span>Zoom:</span>
                        <Button size="xs" className="ml-1" onClick={() => setZoom(1)}>1x</Button>
                        <Button size="xs" className="ml-1" onClick={() => setZoom(2)}>2x</Button>
                        <Button size="xs" className="ml-1"  onClick={() => setZoom(3)}>3x</Button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        layout={displayMode}
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <TimeComponent data-key="time" type="number" scale="time" domain={["dataMin", "dataMax"]} tickCount={20} interval={0} tickFormatter={dateFormatter} reversed={displayMode === "horizontal"}/>
                        <ReferenceLine {...displayMode === "vertical" ? {x: dtNow.getTime()} : {y: dtNow.getTime()}}  stroke="black" strokeWidth={2} strokeOpacity={0.5} type={"dotted"} />
                        <PostComponent dataKey="name" type="category" allowDuplicatedCategory={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {Object.values(onlyAnHourAround).map((t) =>
                            <Line dataKey={t.train_number} label={t.train_number} stroke={configByType[t.type]?.graphColor ?? "purple"}>
                            </Line>
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </>
    );
}

export default React.memo(GraphContent)
