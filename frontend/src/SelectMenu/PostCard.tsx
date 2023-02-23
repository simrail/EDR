import React from "react";
import {optimizedPostsImagesMap, optimizedPostsWebpImagesMap} from "../config";
import {postToInternalIds} from "../config/stations";
import {Link, useParams} from "react-router-dom";

export const PostCard: React.FC<any> = ({post, isWebpSupported}) => {
    const {serverCode} = useParams();
    const realId = postToInternalIds[encodeURIComponent(post.Name)]?.id;
    const postImages = isWebpSupported ? optimizedPostsWebpImagesMap : optimizedPostsImagesMap;
    if (!realId) return null;
    const postCardPath = serverCode ? `/${serverCode}/station/${realId}` : '';

    return (
        <>
            <Link to={postCardPath} className={`flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition duration-150 ease-out hover:scale-105 active:scale-100 hover:shadow-xl dark:hover:bg-gray-700 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 m-4 w-[250px] cursor-pointer ${realId ? 'opacity-100' : 'opacity-30'}`}>
                <span className="h-[110px] w-full bg-gray-300 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${postImages[post.Prefix.toUpperCase() as string]})`}}></span>
                <p className="p-2 w-full font-bold text-slate-700 dark:text-slate-100 flex flex-col items-center">
                    <span>{post.Name}</span>
                </p>
            </Link>
        </>
    )
}
