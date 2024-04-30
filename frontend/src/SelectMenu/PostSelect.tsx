import React from "react";
import {SelectMenuLayout} from "./Layout";
import {getPlayer, getServers, getStations} from "../api/api";
import {Spinner} from "flowbite-react";
import {PostCard} from "./PostCard";
import {useTranslation} from "react-i18next";
import { Server, Station } from "@simrail/types";
import {useParams} from "react-router-dom";
import { SubNavigationProps } from "../EDR/components/SubNavigation";
import { getPreviousAndNextServer } from "../EDR/functions/subNavigation";
import { ISteamUser } from "../config/ISteamUser";

type Props = {
    isWebpSupported: boolean,
}

export const PostSelect: React.FC<Props> = ({isWebpSupported}) => {
    const [posts, setPosts] = React.useState<Station[] | undefined>();
    const [servers, setServers] = React.useState<Server[] | undefined>();
    const [players, setPlayers] = React.useState<ISteamUser[] | undefined>();
    const [subNavigationItems, setSubnavigationItems] = React.useState<SubNavigationProps>();
    const {serverCode} = useParams();
    const {t} = useTranslation();

    React.useEffect(() => {
        if (!serverCode) return;
        getServers().then(setServers);
        getStations(serverCode).then(postData => {
            setPosts(postData);
            const steamIds = postData.map(post => post.DispatchedBy?.[0]?.SteamId).filter((steamId): steamId is Exclude<typeof steamId, undefined> => steamId !== undefined);;
            Promise.all(steamIds.map(getPlayer)).then(setPlayers);
        });
    }, [serverCode]);

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
    }, [servers, serverCode, t]);

    return <SelectMenuLayout 
        title={t("SELECTMENU_post_select")}
        isWebpSupported={isWebpSupported}
        navNextItem={subNavigationItems?.navNextItem}
        navCurrentItem={subNavigationItems?.navCurrentItem}
        navPreviousItem={subNavigationItems?.navPreviousItem}
        serverCode={serverCode}
    >
        {
            !posts
            ? <Spinner size="xl"/>
            : (posts.length === 0)
                ? <div className="bg-white dark:bg-gray-600 rounded p-4">{t("SELECTMENU_no_posts")}</div>
                : posts
                    // Sort posts by their name, move Ł to L, as UTF-8 would place it at the end
                    .sort((post1, post2) => post1.Name.replace('Ł', 'L') < post2.Name.replace('Ł', 'L') ? -1 : 1)
                    .map((post) => <PostCard key={post.Prefix} post={post} isWebpSupported={isWebpSupported} controllingPlayer={players?.find(player => player.steamid === post.DispatchedBy?.[0]?.SteamId)}/>)
        }
    </SelectMenuLayout>;
}

export default PostSelect;