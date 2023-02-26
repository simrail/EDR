import React from "react";
import { getServers, getTrains } from "../api/api";
import { useParams } from "react-router-dom";
import { SelectMenuLayout } from "./Layout";
import { Accordion, Spinner, TextInput } from "flowbite-react";
import { TrainCard } from "./TrainCard";
import { SubNavigationProps } from "../EDR/components/SubNavigation";
import { getPreviousAndNextServer } from "../EDR/functions/subNavigation";
import { Server } from "@simrail/types";
import { useTranslation } from "react-i18next";

export const TrainSelect = () => {
    const [trainFilter, setTrainFilter] = React.useState("");
    const [servers, setServers] = React.useState<Server[] | undefined>();
    const [trains, setTrains] = React.useState<any | undefined>();
    const [subNavigationItems, setSubnavigationItems] = React.useState<SubNavigationProps>();
    const { serverCode } = useParams();
    const { t } = useTranslation();

    React.useEffect(() => {
        if (!serverCode) return;
        getServers().then(setServers);
        getTrains(serverCode).then(setTrains)
    }, []);

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
    }, [servers, serverCode]);

    return (
        <SelectMenuLayout title="TrainSelect" isWebpSupported={false} navNextItem={subNavigationItems?.navNextItem} navCurrentItem={subNavigationItems?.navCurrentItem} navPreviousItem={subNavigationItems?.navPreviousItem}>
            {
                !trains
                    ? <Spinner size="xl" />
                    : (
                            trains.map((t: any) => (
                                <TrainCard key={t.TrainNoLocal} train={t} />
                            ))
                    )
            }
        </SelectMenuLayout>
    )
}
