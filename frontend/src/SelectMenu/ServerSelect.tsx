import React, { useState } from "react";
import { SelectMenuLayout } from "./Layout";
import { getServers } from "../api/api";
import { Spinner } from "flowbite-react";
import { ServerCard } from "./ServerCard";
import { useTranslation } from "react-i18next";
import _sortBy from "lodash/sortBy";
import { console_log } from "../utils/Logger";
import { Server } from "@simrail/types";

type Props = {
    isWebpSupported: boolean
}

export const ServerSelect: React.FC<Props> = ({ isWebpSupported }) => {
    const [servers, setServers] = React.useState<Server[] | undefined>();
    const [serversByRegion, setServersByRegion] = useState<any>();

    const { t, i18n } = useTranslation();

    React.useEffect(() => {
        getServers().then(setServers);
    }, []);

    const language = i18n.language.toUpperCase();

    

    React.useEffect(() => {
        const categorizeServerList = (serverList: Server[]) => {
            const languageTrim = language.substring(0, 2).toLowerCase();
            const orderedServers = _sortBy(serverList, s => {
                return language.includes(s.ServerCode.slice(0, 2).toUpperCase()) ? -1 : 0
            });
    
            const categorized = orderedServers.reduce((result: {[k: string]: Server[]}, server: Server) => {
                const key = server.ServerCode.substring(0, 2);
                (result[key] || (result[key] = [])).push(server);
                return result;
            }, {});
    
            const serversNotInLanguage = Object.fromEntries(
                Object.entries(categorized)
                    .filter(([key]) => key !== languageTrim)
            );
    
            const serversByLanguage = Object.fromEntries(
                Object.entries(categorized)
                    .filter(([key]) => key === languageTrim)
            );
    
            setServersByRegion({
                serversByLanguage: Object.values(serversByLanguage)[0],
                serversNotInLanguage: Object.values(serversNotInLanguage),
            });
        }

        if (servers) {
            categorizeServerList(servers);
        }
    }, [servers, language]);

    
    console_log("servers: ", serversByRegion);

    return <SelectMenuLayout title={t("SELECTMENU_server_selection")} isWebpSupported={isWebpSupported}>
        {
            !serversByRegion
                ? (
                    <div className="flex justify-center items-center">
                        <Spinner size="xl" />
                    </div>
                )
                : (
                    <div className="mt-4">
                        <div>
                            {serversByRegion?.serversByLanguage && (
                                <div className="flex flex-wrap justify-center text-slate-700 dark:text-slate-100">
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
                    </div>
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
            <div className="bg-white p-2 max-w-md rounded-lg shadow-md m-4 text-slate-700 dark:bg-gray-800 dark:text-slate-100 text-center">
                <p className="mb-1">{servers[0].ServerCode.substring(0, 2).toUpperCase()}</p>
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
