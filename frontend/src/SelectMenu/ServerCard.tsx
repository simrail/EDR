import React from "react";
import {Card} from "flowbite-react/lib/esm/components/Card";
import {countries} from "country-flag-icons";
import {countriesFlags} from "../config";
import {console_log} from "../utils/Logger";
import {Link, useNavigate} from "react-router-dom";

export const ServerCard: React.FC<any> = ({server}) => {
    const navigate = useNavigate();
    const serverCountryCode = server.ServerCode.slice(0, 2);
    console_log("c ", countries);
    const flag = countriesFlags[serverCountryCode.toUpperCase()];
    const serverCardPath = server.ServerCode ? `/${server.ServerCode}` : '';

    console_log("falg", flag);
    return (
        <>
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
        </>
    )
}