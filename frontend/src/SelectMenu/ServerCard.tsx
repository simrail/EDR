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

    return itemType === 'item-list' ? (
        <li className="w-[200px]">
            <Link to={serverCardPath} className="flex items-center w-full h-full py-4">
                <div className="relative pr-2 pl-4">
                    <span className={`absolute block w-2 h-2 left-0 rounded-full top-1/2 -translate-y-1/2 ${server.IsActive ? 'bg-green-400' : 'bg-red-600'}`}></span>
                    <span className="child:w-4 child:h-auto" dangerouslySetInnerHTML={{ __html: flag.toString() }} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        {server.ServerName}
                    </p>
                </div>
            </Link>
        </li>
    ) : (
        <Link to={serverCardPath} className="bg-white w-[150px] rounded-lg shadow-md m-4 dark:bg-gray-800 text-center overflow-hidden">
            <span className="child:w-full child:h-auto" dangerouslySetInnerHTML={{ __html: flag.toString() }} />
            <span className="p-2 block text-sm">{server.ServerName}</span>
        </Link>
    )
}
