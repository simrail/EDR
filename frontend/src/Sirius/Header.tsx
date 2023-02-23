import React from "react";

type Props = {
    trainNumber: string;
    trainDetails: any;
    serverCode: string;
}
export const SiriusHeader: React.FC<Props> = ({trainNumber, trainDetails, serverCode}) => {
    return (
        <div style={{position: "sticky", top: 0, zIndex: 99999}} className="w-full bg-white shadow-md dark:bg-slate-800">
            <div className="flex">
                <div>{serverCode} - {trainNumber} - {trainDetails.Vehicles[0]}</div>
            </div>
        </div>
    )
}
