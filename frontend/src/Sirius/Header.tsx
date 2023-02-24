import React from "react";

type Props = {
    trainNumber: string;
    trainDetails: any;
    serverCode: string;
}
export const SiriusHeader: React.FC<Props> = ({trainNumber, trainDetails, serverCode}) => {
    return (
        <div className="sticky z-20 t-0 shadow-md w-full h-[30px] flex items-center bg-white dark:bg-slate-800">
            <div>{serverCode} - {trainNumber} - {trainDetails.Vehicles[0]}</div>
        </div>
    )
}
