import React from "react";
import {SelectMenuLayout} from "./Layout";
import {getServers} from "../api/api";
import {Spinner} from "flowbite-react/lib/esm/components/Spinner";
import {AllowedServers} from "../config";
import {ServerCard} from "./ServerCard";
import {useTranslation} from "react-i18next";
import _sortBy from "lodash/sortBy";
import {console_log} from "../utils/Logger";
import { Server } from "@simrail/types";

export const ServerSelect = () => {
    const [servers, setServers] = React.useState<Server[] | undefined>();
    const {t, i18n} = useTranslation();

    React.useEffect(() => {
        getServers().then(setServers);
    }, []);

    const language = i18n.language.toUpperCase();
    const orderedServers = _sortBy(servers, s => {
        return language.includes(s.ServerCode.slice(0, 2).toUpperCase()) ? -1 : 0
    });
    console_log("servers: ", servers);

    return <SelectMenuLayout title={t("select_menu.server_selection")}>
        {
            !orderedServers
                ? <Spinner/>
                : orderedServers.filter((s) => AllowedServers.includes(s.ServerCode)).map((s) => {
                    return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                })
        }
    </SelectMenuLayout>
};

export default ServerSelect;
