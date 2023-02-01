import React from "react";
import {TimeTableRow} from "../index";
import {nowUTC} from "../../utils/date";
import {getTimetable} from "../../api/api";
import _keyBy from "lodash/keyBy";
import {postConfig, postToInternalIds} from "../../config/stations";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {configByType} from "../../config/trains";
import {format} from "date-fns";
import {getDateWithHourAndMinutes} from "../functions/timeUtils";
import {Modal} from "flowbite-react";

type Props = {
    post: string;
    timetable: TimeTableRow[];
    isOpen: boolean;
    onClose: () => void;
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
                {payload.map((p: any) => {
                    return (
                        <div className="flex justify-between w-full">
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
const Graph: React.FC<Props> = ({timetable, post, onClose, isOpen, serverTz}) => {
    const dtNow = nowUTC(serverTz);
    const currentHourSort = Number.parseInt(format(dtNow, "HHmm"));
    const [neighboursTimetables, setNeighboursTimetables] = React.useState<any>();
    const [data, setData] = React.useState<any[]>();
    const onlyAnHourAround = React.useMemo(() => _keyBy(timetable.filter((ttRow) => Math.abs(ttRow.hourSort - currentHourSort) <= 130), "train_number"), [currentHourSort, timetable]);
    // console.log("Current hour sort : ", currentHourSort);

    React.useEffect(() => {
        const gottenPostConfig = postConfig[post];
        if (!gottenPostConfig.graphConfig?.pre || !gottenPostConfig.graphConfig?.post) return;
        Promise.all([...gottenPostConfig.graphConfig?.pre, ...gottenPostConfig.graphConfig.post].map(getStationTimetable))
            .then(Object.fromEntries)
            .then(setNeighboursTimetables)
    }, [post]);

    React.useEffect(() => {
        if (!neighboursTimetables || !onlyAnHourAround) return;
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
                const foundNextPostIdx = postsToScan.findIndex((v) => v === nextPost);
                const isTrainGoingToKatowice = foundNextPostIdx > postIdx || (foundNextPostIdx === -1 && postIdx === postsToScan.length - 1);
                // console.log("ITGTK ", isTrainGoingToKatowice);
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
                const foundNextPostIdx = postsToScan.findIndex((v) => v === nextPost);
                const isTrainGoingToKatowice = foundNextPostIdx > postIdx || (foundNextPostIdx === -1 && postIdx === postsToScan.length - 1);
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
    }, [neighboursTimetables, onlyAnHourAround, currentHourSort, post, serverTz])

    // console.log("Rendered graph", onlyAnHourAround);
    return (
        <Modal className="z-50" position="bottom-center" show={isOpen}  size="9xl" onClose={onClose} style={{zIndex: 999999}}>
            <Modal.Header>
                <div className="flex justify-around">
                    <span>Dispatcher Graph (Beta)</span>
                </div>
            </Modal.Header>
            <Modal.Body className="h-[600px]">
                <div className="text-center">This graph shows scheduled departure and arrival</div>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        layout="vertical"
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
                        <XAxis type="number" scale="time" domain={["dataMin", "dataMax"]} tickCount={15} interval={0} tickFormatter={dateFormatter}/>
                        <YAxis dataKey="name" type="category" allowDuplicatedCategory={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {Object.values(onlyAnHourAround).map((t) =>
                            <Line dataKey={t.train_number} stroke={configByType[t.type]?.graphColor ?? "purple"} label="test">
                            </Line>
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </Modal.Body>
</Modal>);
}

export default React.memo(Graph)
