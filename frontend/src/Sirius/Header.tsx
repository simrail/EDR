import { DarkThemeToggle } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { countriesFlags } from "../config";

type Props = {
    trainNumber: string;
    trainDetails: any;
    serverCode: string;
}
export const SiriusHeader: React.FC<Props> = ({trainNumber, trainDetails, serverCode}) => {
    return (
        <div className="sticky z-20 px-2 t-0 shadow-md w-full h-[30px] flex columns-3 items-center bg-white dark:bg-slate-800">
            <div className="w-full flex">
                <Link to={`/${serverCode}/trains`} className="flex underline hover:no-underline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75" />
                    </svg>
                    Back to Trains
                </Link>
            </div>
            <div className="w-full flex justify-center items-center">
                <span className="ml-2 mr-1 child:w-6 child:h-auto shadow-md" dangerouslySetInnerHTML={{ __html: countriesFlags[serverCode.slice(0, 2).toUpperCase()].toString() }} />
                    <span className="font-bold mr-2">{serverCode.toUpperCase()}
                </span>
                - {trainNumber} - {trainDetails.Vehicles[0]}
            </div>
            <div className="w-full flex justify-end">
                <DarkThemeToggle className="!p-0" />
            </div>
        </div>
    )
}
