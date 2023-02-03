import React from "react";
import {Card} from "flowbite-react/lib/esm/components/Card";
import {optimizedPostsImagesMap, optimizedPostsWebpImagesMap} from "../config";
import classNames from "classnames";
import {postToInternalIds} from "../config/stations";
import {useNavigate, useParams} from "react-router-dom";

export const PostCard: React.FC<any> = ({post, isWebpSupported}) => {
    const {serverCode} = useParams();
    const navigate = useNavigate();
    const realId = postToInternalIds[encodeURIComponent(post.Name)]?.id;
    const postImages = isWebpSupported ? optimizedPostsWebpImagesMap : optimizedPostsImagesMap;

    if (!realId) return null;
    return (
        <Card className={classNames("m-4 max-w-[200px]", {"cursor-pointer": !!realId})} imgSrc={postImages[post.Prefix.toUpperCase() as string]} style={{opacity: realId ? 1 : 0.3}} onClick={() => {
            if (!realId || !serverCode) return;
            navigate(`/${serverCode}/station/${realId}`);
        }}>
            {post.Name}
        </Card>
    )
}
