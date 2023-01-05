import React from "react";
import {SelectMenuLayout} from "./Layout";
import {getServers} from "../api/api";
import {Spinner} from "flowbite-react";
import {AllowedServers} from "../config";
import {ServerCard} from "./ServerCard";
import {useTranslation} from "react-i18next";

export const ServerSelect = () => {
    const [servers, setServers] = React.useState<any | undefined>();
    const {t} = useTranslation();

    React.useEffect(() => {
        getServers().then(setServers);
    }, []);

    // console.log("servers: ", servers);

    return <SelectMenuLayout title={t("select_menu.server_selection")}>
        {
            !servers
                ? <Spinner />
                : servers.filter((s: any) => AllowedServers.includes(s.ServerCode)).map((s: any) => {
                        return <ServerCard server={s} size="xl"/>
                    })
        }
    </SelectMenuLayout>;
}
