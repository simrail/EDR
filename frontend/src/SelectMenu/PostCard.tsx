import React from "react";
import {optimizedPostsImagesMap, optimizedPostsWebpImagesMap} from "../config";
import {postToInternalIds} from "../config/stations";
import {Link, useParams} from "react-router-dom";
import { Station } from "@simrail/types";
import { ISteamUser } from "../config/ISteamUser";

type Props = {
    post: Station,
    isWebpSupported: boolean,
    controllingPlayer: ISteamUser | undefined
}

export const PostCard: React.FC<Props> = ({post, isWebpSupported, controllingPlayer}) => {
    const {serverCode} = useParams();
    const realId = postToInternalIds[encodeURIComponent(post.Name)]?.id;
    const postImages = isWebpSupported ? optimizedPostsWebpImagesMap : optimizedPostsImagesMap;
    if (!realId) return null;
    const postCardPath = serverCode ? `/${serverCode}/station/${realId}` : '';

    return (
        <Link to={postCardPath} className={`flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition duration-150 ease-out hover:scale-105 active:scale-95 hover:shadow-xl dark:hover:bg-gray-700 dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 m-4 w-[250px] cursor-pointer ${realId ? 'opacity-100' : 'opacity-30'}`}>
            <span className="h-[110px] w-full bg-gray-300 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${postImages[post.Prefix.toUpperCase() as string]})`}}>
            <div className="flex justify-center bg-white dark:bg-gray-800">
                {
                    controllingPlayer?.personaname
                        ? <span className="flex items-center"><img className="mx-2" width={16} src={controllingPlayer?.avatar} alt="avatar" /><span className="md:inline">{controllingPlayer?.personaname}</span></span>
                        : <></>
                }
            </div>
            </span>
            <p className="p-2 w-full font-bold text-slate-700 dark:text-slate-100 flex flex-col items-center">
                <span>{post.Name}</span>
            </p>
        </Link>
    )
}
