import React from "react";
import { countriesFlags } from "../config";
import { console_log } from "../utils/Logger";
import { Link } from "react-router-dom";
import { Server } from "@simrail/types";

type Props = {
    server: Server;
    itemType: string;
}

export const ServerCard: React.FC<Props> = ({ server, itemType }) => {
    const serverCountryCode = server.ServerCode.slice(0, 2);
    const flag = countriesFlags[serverCountryCode.toUpperCase()];
    const serverCardPath = server.ServerCode ? `/${server.ServerCode}` : '';
    
    const textTooLong = (text: string) => {
        const regex = /\[(.*?)\]/g;
        const match = text.match(regex);
        const result = text.replace(regex, "");

        return {
            mainText: result,
            secondaryText: match && match[0].replace("[", "").replace("]", "")
        };
    }

    return itemType === 'item-list' ? (
        <li className="w-[200px]">
            <Link to={serverCardPath} className="flex items-center w-full h-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="relative pr-2 pl-4">
                    <span className={`absolute block w-2 h-2 left-0 rounded-full top-1/2 -translate-y-1/2 ${server.IsActive ? 'bg-green-400' : 'bg-red-600'}`}></span>
                    <span className="child:w-4 child:h-auto" dangerouslySetInnerHTML={{ __html: flag.toString() }} />
                </div>
                <div className="min-w-0 flex flex-wrap text-left">
                    <p className="text-sm font-medium truncate w-full">
                        {textTooLong(server.ServerName).mainText}
                    </p>
                    <p className="text-sm font-medium truncate w-full">
                        {textTooLong(server.ServerName).secondaryText}
                    </p>
                </div>
            </Link>
        </li>
    ) : (
        <Link to={serverCardPath} className="relative bg-white w-[150px] rounded-lg shadow-md m-4 dark:bg-gray-800 text-center transition duration-150 ease-out hover:scale-105 active:scale-100 hover:shadow-xl hover:bg-gray-200 dark:hover:bg-gray-700">
            <span className="child:w-full child:h-auto child:rounded-t-lg" dangerouslySetInnerHTML={{ __html: flag.toString() }} />
            <span className="p-2 flex flex-wrap w-full justify-center items-center text-sm initial child:hover:opacity-100">
                <span className={`inline-flex mr-2 w-2 basis-2 shrink-0 grow-0 h-2 text-xs font-bold ${server.IsActive ? 'bg-green-400' : 'bg-red-600'} rounded-full dark:border-gray-900`}></span>
                <span>{textTooLong(server.ServerName).mainText}</span>
                {textTooLong(server.ServerName).secondaryText && (
                    <span className="transition-all opacity-0 p-2 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 text-xs font-medium absolute top-0 left-0 right-0 bottom-0 flex items-center">
                        {textTooLong(server.ServerName).secondaryText}
                    </span>
                )}
            </span>
        </Link>
    )
}
