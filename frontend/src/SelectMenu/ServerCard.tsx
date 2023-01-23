import React from "react";
import {Card} from "flowbite-react";
import {countries} from "country-flag-icons";
import {countriesFlags} from "../config";
import {console_log} from "../utils/Logger";
import {useNavigate} from "react-router-dom";

export const ServerCard: React.FC<any> = ({server}) => {
    const navigate = useNavigate();
    const serverCountryCode = server.ServerCode.slice(0, 2);
    console_log("c ", countries);
    const flag = countriesFlags[serverCountryCode.toUpperCase()];

    console_log("falg", flag);
    return (
        <Card className="m-4 cursor-pointer w-[150px] text-center" onClick={() => {
            navigate("/" + server.ServerCode);
        }} imgSrc={"data:image/svg+xml;base64, " + btoa(flag)}>
            {server.ServerName}
        </Card>
    )
}