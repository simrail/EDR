import React, { useState } from "react";
import { SelectMenuLayout } from "./Layout";
import { getServers } from "../api/api";
import { Spinner } from "flowbite-react/lib/esm/components/Spinner";
import { ServerCard } from "./ServerCard";
import { useTranslation } from "react-i18next";
import _sortBy from "lodash/sortBy";
import { console_log } from "../utils/Logger";
import { Server } from "@simrail/types";
import _ from "lodash";

type Props = {
    isWebpSupported: boolean
}

export const ServerSelect: React.FC<Props> = ({ isWebpSupported }) => {
    const [servers, setServers] = React.useState<Server[] | undefined>();
    const [serversByRegion, setServersByRegion] = useState<any>();

    console.log(">>>>> SEERVERS", serversByRegion);

    const { t, i18n } = useTranslation();

    React.useEffect(() => {
        getServers().then(setServers);
    }, []);

    const language = i18n.language.toUpperCase();

    React.useEffect(() => {
        if (servers) {
            categorizeServerList(servers);
        }
    }, [servers, language]);

    const categorizeServerList = (serverList: Server[]) => {
        const orderedServers = _sortBy(serverList, s => {
            return language.includes(s.ServerCode.slice(0, 2).toUpperCase()) ? -1 : 0
        });

        const categorized = orderedServers.reduce((result: any, server: Server) => {
            const key = server.ServerCode.substring(0, 2);
            (result[key] || (result[key] = [])).push(server);
            return result;
        }, {});

        const serversNotInLanguage = Object.fromEntries(
            Object.entries(categorized)
                .filter(([key]) => key !== language.toLowerCase())
        );

        const serversByLanguage = Object.fromEntries(
            Object.entries(categorized)
                .filter(([key]) => key === language.toLowerCase())
        );

        setServersByRegion({
            serversByLanguage: Object.values(serversByLanguage)[0],
            serversNotInLanguage: Object.values(serversNotInLanguage),
        });
    }
    console_log("servers: ", serversByRegion);

    return <SelectMenuLayout title={t("SELECTMENU_server_selection")} isWebpSupported={isWebpSupported}>
        {
            !serversByRegion
                ? <Spinner />
                : (
                    <>
                        <div>
                            {serversByRegion?.serversByLanguage && (
                                <div className="flex flex-wrap justify-center">
                                    {/* {serversByRegion.serversByLanguage[0].ServerCode.substring(0, 2).toUpperCase()} */}
                                    {serversByRegion.serversByLanguage.map((s: Server) => (
                                        <ServerCard key={s.ServerCode} server={s} itemType={'item-card'} />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-wrap justify-center">
                            {serversByRegion?.serversNotInLanguage && (
                                serversByRegion.serversNotInLanguage.map((subCategory: Server[], index: number) => (
                                    <ServerList key={`server-${index}`} servers={subCategory} />
                                ))
                            )}
                        </div>
                    </>
                )
        }
    </SelectMenuLayout>
};

type ServerListProps = {
    servers: Server[];
}

export const ServerList: React.FC<ServerListProps> = ({ servers }) => {
    return (
        <>
            <div className="bg-white px-4 py-2 max-w-md rounded-lg shadow-md m-4 dark:bg-gray-800">
                {/* {servers[0].ServerCode.substring(0, 2).toUpperCase()} */}
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {servers.map((s: Server) => (
                        <ServerCard key={s.ServerCode} server={s} itemType={'item-list'} />
                    ))}
                </ul>
            </div>
        </>
    )
}

export default ServerSelect;
