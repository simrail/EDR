import React from "react";
import { Card } from "flowbite-react/lib/esm/components/Card";
import { configByLoco } from "../config/trains";
import { useNavigate, useParams } from "react-router-dom";
import { Train } from "@simrail/types";

type Props = {
    train: Train;
}
export const TrainCard: React.FC<Props> = ({ train }) => {
    const { serverCode } = useParams();

    const navigate = useNavigate();
    const trainConfig = configByLoco[train?.Vehicles[0]];
    return (
        <Card className="min-w-[150px] flex items-center m-4 cursor-pointer transition duration-150 ease-out hover:scale-105 active:scale-95 hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => {
            if (!train.TrainNoLocal || !serverCode) return;
            navigate(`/${serverCode}/train/${train.TrainNoLocal}`);
        }}>
            {trainConfig?.icon ? <div className="flex items-center"><img src={trainConfig.icon} width={120} alt="train icon"/></div> : null }
            <div className="text-center">
                <span className="font-bold">{train.TrainNoLocal}</span>&nbsp;- {train?.Vehicles[0].split("/")[0]}
            </div>
        </Card>
    );
}
