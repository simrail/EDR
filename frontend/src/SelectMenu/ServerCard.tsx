import React from "react";
import {Card} from "flowbite-react";
import {StringParam, useQueryParam} from "use-query-params";
import {countries} from "country-flag-icons";
import {countriesFlags} from "../config";
import {console_log} from "../utils/Logger";

export const ServerCard: React.FC<any> = ({server}) => {
    const [_, setServerParam] = useQueryParam('serverCode', StringParam);
    const serverCountryCode = server.ServerCode.slice(0, 2);
    console_log("c ", countries);
    const flag = countriesFlags[serverCountryCode.toUpperCase()];

    console_log("falg", flag);
    return (
        <Card className="m-4 cursor-pointer w-[150px] text-center" onClick={() => {
            setServerParam(server.ServerCode);
            window.history.go();
        }} imgSrc={"data:image/svg+xml;base64, " + btoa(flag)}>
            {server.ServerName}
        </Card>
    )
}