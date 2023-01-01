import React from "react";
import {SelectMenuLayout} from "./Layout";
import {StringParam, useQueryParam} from "use-query-params";
import {getStations} from "../api/getTimetable";
import {Spinner} from "flowbite-react";
import {PostCard} from "./PostCard";

export const PostSelect = () => {
    const [posts, setPosts] = React.useState<any | undefined>();
    const [serverCode, _] = useQueryParam('serverCode', StringParam);

    React.useEffect(() => {
        if (!serverCode) return;
        getStations(serverCode).then(setPosts);
    }, []);

    // console.log("Postes : ", posts);

    return <SelectMenuLayout title="Selection du poste">
        {
            !posts
            ? <Spinner size="xl"/>
            : posts.map((post: any) => <PostCard post={post} />)
        }
    </SelectMenuLayout>;
}