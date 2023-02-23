import React from "react";
import {SelectMenuLayout} from "./Layout";
import {getServers} from "../api/api";
import {Spinner} from "flowbite-react/lib/esm/components/Spinner";
import {ServerCard} from "./ServerCard";
import {useTranslation} from "react-i18next";
import _sortBy from "lodash/sortBy";
import {console_log} from "../utils/Logger";
import { Server } from "@simrail/types";

type Props = {
    isWebpSupported: boolean
}

export const ServerSelect: React.FC<Props> = ({isWebpSupported}) => {
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
    console.log("servers: ", orderedServers);

    return <SelectMenuLayout title={t("SELECTMENU_server_selection")} isWebpSupported={isWebpSupported}>
        {
            !orderedServers
                ? <Spinner/>
                : (
                    <>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^en/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^cn/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^cz/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^de/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^es/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^fr/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^hu/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^it/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^p/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>
                        <ul className="bg-white px-4 max-w-md divide-y divide-gray-200 rounded-lg shadow-md dark:divide-gray-700 m-4 dark:bg-gray-800">
                            {orderedServers.filter(item => /^ua/i.test(item.ServerCode)).map((s) => {
                                return <ServerCard key={s.ServerCode} server={s} size="xl"/>
                            })}
                        </ul>

                    </>
                )
        }
    </SelectMenuLayout>
};

export default ServerSelect;
