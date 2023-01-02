import React from "react";
import {SelectMenuLayout} from "./Layout";
import {getServers} from "../api/getTimetable";
import {Spinner} from "flowbite-react";
import {AllowedServers} from "../EDR/config";
import {ServerCard} from "./ServerCard";
import {useTranslation} from "react-i18next";

export const ServerSelect = () => {
    const [servers, setServers] = React.useState<any | undefined>();
    const {t} = useTranslation();

    React.useEffect(() => {
        getServers().then(setServers);
    }, []);

    // console.log("servers: ", servers);

    return <SelectMenuLayout title="Selection du serveur">
        {
            !servers
                ? <Spinner />
                : servers.filter((s: any) => AllowedServers.includes(s.ServerCode)).map((s: any) => {
                        return <ServerCard server={s} size="xl"/>
                    })
        }
    </SelectMenuLayout>;
}
