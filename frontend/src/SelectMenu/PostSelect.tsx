import React from "react";
import {SelectMenuLayout} from "./Layout";
import {getServers, getStations} from "../api/api";
import {Spinner} from "flowbite-react/lib/esm/components/Spinner";
import {PostCard} from "./PostCard";
import {useTranslation} from "react-i18next";
import { Server, Station } from "@simrail/types";
import {Link, useParams} from "react-router-dom";
import { SubNavigationProps } from "../EDR/components/SubNavigation";
import { countriesFlags } from "../config";
import { getPreviousAndNextServer } from "../EDR/functions/subNavigation";

type Props = {
    isWebpSupported: boolean,
}

export const PostSelect: React.FC<Props> = ({isWebpSupported}) => {
    const [posts, setPosts] = React.useState<Station[] | undefined>();
    const [servers, setServers] = React.useState<Server[] | undefined>();
    const [subNavigationItems, setSubnavigationItems] = React.useState<SubNavigationProps>();
    const {serverCode} = useParams();
    const {t} = useTranslation();

    React.useEffect(() => {
        if (!serverCode) return;
        getServers().then(setServers);
        getStations(serverCode).then(setPosts);
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        setSubnavigationItems(getPreviousAndNextServer({ 
            servers,
            currentServer: serverCode,
            text: {
                previousLabel: t("SELECTMENU_nav_previous_server") || '',
                nextLabel: t("SELECTMENU_nav_next_server") || '',
                currentLabel: t("SELECTMENU_nav_current_server") || '',
            }
        }));
    }, [servers, serverCode]);

    return <SelectMenuLayout title={t("SELECTMENU_post_select")} isWebpSupported={isWebpSupported} navNextItem={subNavigationItems?.navNextItem} navCurrentItem={subNavigationItems?.navCurrentItem} navPreviousItem={subNavigationItems?.navPreviousItem}>
        {
            !posts
            ? <Spinner size="xl"/>
            : posts.map((post) => <PostCard key={post.Prefix} post={post} isWebpSupported={isWebpSupported}/>)
        }
    </SelectMenuLayout>;
}

export default PostSelect;