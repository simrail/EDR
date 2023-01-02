import React from "react";
import {SelectMenuLayout} from "./Layout";
import {StringParam, useQueryParam} from "use-query-params";
import {getStations} from "../api/getTimetable";
import {Spinner} from "flowbite-react";
import {PostCard} from "./PostCard";
import {useTranslation} from "react-i18next";

export const PostSelect = () => {
    const [posts, setPosts] = React.useState<any | undefined>();
    const [serverCode, _] = useQueryParam('serverCode', StringParam);
    const {t} = useTranslation();

    React.useEffect(() => {
        if (!serverCode) return;
        getStations(serverCode).then(setPosts);
    }, []);

    // console.log("Postes : ", posts);

    return <SelectMenuLayout title={t("select_menu.post_select")}>
        {
            !posts
            ? <Spinner size="xl"/>
            : posts.map((post: any) => <PostCard post={post} />)
        }
    </SelectMenuLayout>;
}