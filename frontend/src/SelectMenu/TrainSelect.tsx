import React from "react";
import {getTrains} from "../api/api";
import {useParams} from "react-router-dom";
import {SelectMenuLayout} from "./Layout";
import {Spinner, TextInput} from "flowbite-react";
import {TrainCard} from "./TrainCard";

export const TrainSelect = () => {
    const [trainFilter, setTrainFilter] = React.useState("");
    const [trains, setTrains] = React.useState<any | undefined>();
    const {serverCode} = useParams();

    React.useEffect(() => {
        if (!serverCode) return;
        getTrains(serverCode).then(setTrains)
    }, [])

    return (
        <SelectMenuLayout title="TrainSelect" isWebpSupported={false}>
            {
                !trains
                ? <Spinner size="xl" />
                : trains.map((t: any) => <TrainCard key={t.TrainNoLocal} train={t} />)
            }
        </SelectMenuLayout>
    )
}
