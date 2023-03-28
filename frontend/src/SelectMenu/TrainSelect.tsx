import React from "react";
import { getPlayer, getServers, getTrains } from "../api/api";
import { useParams} from "react-router-dom";
import { SelectMenuLayout } from "./Layout";
import { Spinner} from "flowbite-react";
import { TrainCard } from "./TrainCard";
import { SubNavigationProps } from "../EDR/components/SubNavigation";
import { getPreviousAndNextServer } from "../EDR/functions/subNavigation";
import { Server, Train } from "@simrail/types";
import { useTranslation } from "react-i18next";
import { ISteamUser } from "../config/ISteamUser";

export const TrainSelect = () => {
    const [trainFilter, setTrainFilter] = React.useState<Train[] | undefined>();
    const [searchTrainInput, setSearchTrainInput] = React.useState('');
    const [servers, setServers] = React.useState<Server[] | undefined>();
    const [trains, setTrains] = React.useState<Train[] | undefined>();
    const [subNavigationItems, setSubnavigationItems] = React.useState<SubNavigationProps>();
    const [players, setPlayers] = React.useState<ISteamUser[] | undefined>();
    const { serverCode } = useParams();
    const { t } = useTranslation();

    React.useEffect(() => {
        if (!serverCode) return;
        getServers().then(setServers);
        getTrains(serverCode).then(data => setTrains(data.sort((train1, train2) => parseInt(train1.TrainNoLocal) - parseInt(train2.TrainNoLocal))));
    }, [serverCode]);

    React.useEffect(() => {
        if (searchTrainInput) {
            setTrainFilter(trains?.filter((train) => train.TrainNoLocal.includes(searchTrainInput)));
        } else {
            setTrainFilter(trains);
        }
    }, [trains, searchTrainInput]);

    React.useEffect(() => {
        if (!trains) return;
        const allPlayerIds = trains.map((t) => t.TrainData.ControlledBySteamID).filter((trainNumber): trainNumber is Exclude<typeof trainNumber, null> => trainNumber !== null);
        if (allPlayerIds.length === 0) return;
        Promise.all(allPlayerIds.map(getPlayer)).then(setPlayers);
    }, [trains])

    React.useEffect(() => {
        setSubnavigationItems(getPreviousAndNextServer({ 
            servers,
            currentServer: serverCode,
            text: {
                previousLabel: t("SELECTMENU_nav_previous_server") || '',
                nextLabel: t("SELECTMENU_nav_next_server") || '',
                currentLabel: t("SELECTMENU_nav_current_server") || '',
            },
            isTrainList: true,
        }));
    }, [servers, serverCode, t]);

    return (
        <SelectMenuLayout 
            title={"TrainSelect"}
            isWebpSupported={false}
            navNextItem={subNavigationItems?.navNextItem}
            navCurrentItem={subNavigationItems?.navCurrentItem}
            navPreviousItem={subNavigationItems?.navPreviousItem}
            serverCode={serverCode}
        >
            {
                !trains
                    ? <Spinner size="xl" />
                    : (
                        <div className="w-full flex flex-col">
                            <div className="w-3/4 max-w-[600px] mx-auto">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </div>
                                    <input value={searchTrainInput} onChange={(e) => setSearchTrainInput(e.target.value)} type="search" id="search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for train number..." required />
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center pt-4">
                                {trainFilter && trainFilter.filter(t => parseInt(t.TrainNoLocal) < 10000).map((t) => (
                                    <TrainCard key={t.TrainNoLocal} train={t} player={players?.find(player => player.steamid === t.TrainData.ControlledBySteamID)} />
                                ))}
                            </div>
                            <div className="flex flex-wrap justify-center pt-4">
                                {trainFilter && trainFilter.filter(t => parseInt(t.TrainNoLocal) >=10000 && parseInt(t.TrainNoLocal) < 100000).map((t) => (
                                    <TrainCard key={t.TrainNoLocal} train={t} player={players?.find(player => player.steamid === t.TrainData.ControlledBySteamID)} />
                                ))}
                            </div>
                            <div className="flex flex-wrap justify-center pt-4">
                                {trainFilter && trainFilter.filter(t => parseInt(t.TrainNoLocal) >= 100000).map((t) => (
                                    <TrainCard key={t.TrainNoLocal} train={t} player={players?.find(player => player.steamid === t.TrainData.ControlledBySteamID)} />
                                ))}
                            </div>
                        </div>
                    )
            }
        </SelectMenuLayout>
    )
}

export default TrainSelect;
