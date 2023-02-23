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
        getPreviousAndNextServer(servers, serverCode);
    }, [servers, serverCode])

    const getPreviousAndNextServer = (servers: Server[] | undefined, currentServer: string | undefined) => {
        if (!servers || !currentServer) return;

        const lastIndex = servers.length - 1;
        const currentIndex = servers.findIndex(server => server.ServerCode === currentServer);

        const nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
        const previousIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
        
        const { [nextIndex]: nextItem, [previousIndex]: previousItem } = servers;

        setSubnavigationItems({
            navPreviousItem: previousItem?.ServerCode && (
                <Link to={`/${previousItem.ServerCode}`} className="underline underline-offset-2 hover:no-underline text-slate-500 dark:text-slate-300 flex items-center">
                    {t("SELECTMENU_nav_previous_server")}
                    <span className="ml-2 mr-1 child:w-6 child:h-auto" dangerouslySetInnerHTML={{ __html: countriesFlags[previousItem.ServerCode.slice(0, 2).toUpperCase()].toString() }} />
                    <span className="font-bold">{previousItem.ServerCode.toUpperCase()}</span>
                </Link>
            ),
            navNextItem: nextItem?.ServerCode && (
                <Link to={`/${nextItem.ServerCode}`} className="underline underline-offset-2 hover:no-underline text-slate-500 dark:text-slate-300 flex items-center ml-auto">{t("SELECTMENU_nav_next_server")}
                    <span className="ml-2 mr-1 child:w-6 child:h-auto" dangerouslySetInnerHTML={{ __html: countriesFlags[nextItem.ServerCode.slice(0, 2).toUpperCase()].toString() }} />
                    <span className="font-bold">{nextItem.ServerCode?.toUpperCase()}</span>
                </Link>
            ),
            navCurrentItem: serverCode && (
                <Link to={`/`} className="uppercase font-bold text-slate-500 dark:text-slate-300 flex items-center">
                    {t("SELECTMENU_nav_current_server")}
                    <span className="ml-2 mr-1 child:w-6 child:h-auto" dangerouslySetInnerHTML={{ __html: countriesFlags[serverCode.slice(0, 2).toUpperCase()].toString() }} />
                    <span className="font-bold">{serverCode.toUpperCase()}</span>
                </Link>
            )
        })
        return { nextItem, previousItem };
    }

    return <SelectMenuLayout title={t("SELECTMENU_post_select")} isWebpSupported={isWebpSupported} navNextItem={subNavigationItems?.navNextItem} navCurrentItem={subNavigationItems?.navCurrentItem} navPreviousItem={subNavigationItems?.navPreviousItem}>
        {
            !posts
            ? <Spinner size="xl"/>
            : posts.map((post) => <PostCard key={post.Prefix} post={post} isWebpSupported={isWebpSupported}/>)
        }
    </SelectMenuLayout>;
}

export default PostSelect;