import React from "react";
import {TimeTableRow} from "../index";
import {nowUTC} from "../../utils/date";
import {getTimetable} from "../../api/api";
import _keyBy from "lodash/keyBy";
import {postConfig} from "../../config/stations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import _sortBy from "lodash/sortBy";
import {configByType} from "../../config/trains";

const Data = [
    {
        name: 'Page A',
        435: 4000,
        436: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        435: 1000,
        436: 2398,
        amt: 2210,
    },
    {
        name: 'Page B',
        435: 3000,
        436: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];
type Props = {
    post: string;
    timetable: TimeTableRow[];
}

const generatePostDataPointsForTrain = (timeTableRow: TimeTableRow, postId: string) => {
    if (!timeTableRow) return [];
    const [arrivalHours, arrivalMinutes] = timeTableRow.scheduled_arrival.split(":")
    const [departureHours, departureMinutes] = timeTableRow.scheduled_departure.split(":");
    // console.log([arrivalHours, arrivalMinutes])
    // console.log([departureHours, departureMinutes])
    return [
        {
            "x": arrivalHours + arrivalMinutes,
            "y": postId
        },
        {
            "x": departureHours + departureMinutes,
            "y": postId
        }
    ];
}

const getStationTimetable = (postId: string) => {
    return getTimetable(postId).then((d) => [postId, _keyBy(d, "train_number")]);
}
export const Graph: React.FC<Props> = ({timetable, post}) => {
    const dtNow = nowUTC(); // TODO: Pass timezone
    const currentHourSort = Number.parseInt(`${dtNow.getHours()}${dtNow.getMinutes()}`);
    const [neighboursTimetables, setNeighboursTimetables] = React.useState<any>();
    const [data, setData] = React.useState<any[]>();
    const onlyAnHourAround = React.useMemo(() => _keyBy(timetable.filter((ttRow) => Math.abs(ttRow.hourSort - currentHourSort) <= 120), "train_number"), []);
    // console.log("Current hour sort : ", currentHourSort);

    React.useEffect(() => {
        const gottenPostConfig = postConfig[post];
        if (!gottenPostConfig.graphConfig?.pre || !gottenPostConfig.graphConfig?.post) return;
        Promise.all([...gottenPostConfig.graphConfig?.pre, ...gottenPostConfig.graphConfig.post].map(getStationTimetable))
            .then(Object.fromEntries)
            .then(setNeighboursTimetables)
    }, []);

    React.useEffect(() => {
        if (!neighboursTimetables || !onlyAnHourAround) return;
        const gottenPostConfig = postConfig[post];
        if (!gottenPostConfig.graphConfig?.pre || !gottenPostConfig.graphConfig?.post) return;
        console.log(neighboursTimetables)

        const data = [...gottenPostConfig.graphConfig!.pre, post, ...gottenPostConfig.graphConfig!.post].flatMap((postId) => {

            const allTrainDepartures = Object.fromEntries(Object.values(onlyAnHourAround).map((t) => {
                const targetTrain = postId === post ? t : neighboursTimetables[postId]?.[t.train_number];
                if (!targetTrain) return []
                return [targetTrain.train_number, targetTrain?.scheduled_departure.split(":").join('')]
            }))
            const allTrainArrivals = Object.fromEntries(Object.values(onlyAnHourAround).map((t) => {
                const targetTrain = neighboursTimetables[postId]?.[t.train_number] ?? t;
                return [targetTrain.train_number, targetTrain?.scheduled_arrival.split(":").join('')]
            }))
            console.log("All train departures : ", allTrainDepartures);
            return [{
                name: postId,
                ...allTrainArrivals
            }, {
                name: postId,
                ...allTrainDepartures
            }]
        });

        console.log("Final data : ", data);
        setData(data);
    }, [neighboursTimetables, onlyAnHourAround])

    // console.log("Rendered graph", onlyAnHourAround);
    return <div className="h-screen">
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
            <XAxis type="number" domain={["dataMin", "dataMax"]} tickCount={10} interval={0}/>
            <YAxis dataKey="name" type="category" allowDuplicatedCategory={false} />
            <Tooltip />
            <Legend />
            {Object.values(onlyAnHourAround).map((t) =>
                <Line dataKey={t.train_number} stroke={configByType[t.type]?.graphColor ?? "purple"} />
            )}
        </LineChart>
    </ResponsiveContainer></div>;
}
