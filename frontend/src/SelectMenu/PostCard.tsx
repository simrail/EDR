import React from "react";
import {Card} from "flowbite-react";
import {StringParam, useQueryParam} from "use-query-params";
import {PostNameToIdentifier} from "../EDR/config";
import classNames from "classnames";

export const PostCard: React.FC<any> = ({post}) => {
    const [postParam, setPostParam] = useQueryParam('post', StringParam);
    const realId = PostNameToIdentifier[encodeURIComponent(post.Name)]

    return (
        <Card className={classNames("m-4 max-w-[200px]", {"cursor-pointer": !!realId})} imgSrc={post.MainImageURL} style={{opacity: realId ? 1 : 0.3}} onClick={() => {
            if (!realId) return;
            setPostParam(realId);
            window.history.go();
        }}>
            {post.Name}
        </Card>
    )
}
