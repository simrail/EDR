import { Server } from "@simrail/types";
import { Link } from "react-router-dom";
import { countriesFlags } from "../../config";

type Props = {
    servers: Server[] | undefined;
    currentServer: string | undefined;
    text?: {
        previousLabel?: string;
        nextLabel?: string;
        currentLabel?: string;
    };
    isTrainList?: boolean;
}

export const getPreviousAndNextServer = ({ servers, currentServer, text, isTrainList }: Props) => {
    if (!servers || !currentServer) return;

    const lastIndex = servers.length - 1;
    const currentIndex = servers.findIndex(server => server.ServerCode === currentServer);

    const nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    const previousIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
    
    const { [nextIndex]: nextItem, [previousIndex]: previousItem } = servers;

    return {
        navPreviousItem: previousItem?.ServerCode && (
            <Link to={`/${previousItem.ServerCode}${isTrainList ? '/trains' : ''}`} className="underline underline-offset-2 hover:no-underline text-slate-500 dark:text-slate-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span className="hidden sm:block">{text?.previousLabel}</span>
                <span className="ml-2 mr-1 child:w-6 child:h-auto" dangerouslySetInnerHTML={{ __html: countriesFlags[previousItem.ServerCode.slice(0, 2).toUpperCase()]?.toString() }} />
                <span className="font-bold">{previousItem.ServerCode.toUpperCase()}</span>
            </Link>
        ),
        navNextItem: nextItem?.ServerCode && (
            <Link to={`/${nextItem.ServerCode}${isTrainList ? '/trains' : ''}`} className="underline underline-offset-2 hover:no-underline text-slate-500 dark:text-slate-300 flex items-center ml-auto">
                <span className="hidden sm:block">{text?.nextLabel}</span>
                <span className="ml-2 mr-1 child:w-6 child:h-auto" dangerouslySetInnerHTML={{ __html: countriesFlags[nextItem.ServerCode.slice(0, 2).toUpperCase()]?.toString() }} />
                <span className="font-bold">{nextItem.ServerCode?.toUpperCase()}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </Link>
        ),
        navCurrentItem: currentServer && (
            <Link to={`/`} className="uppercase font-bold text-slate-500 dark:text-slate-300 flex items-center">
                <span className="hidden sm:block">{text?.currentLabel}</span>
                <span className="ml-2 mr-1 child:w-6 child:h-auto" dangerouslySetInnerHTML={{ __html: countriesFlags[currentServer.slice(0, 2).toUpperCase()]?.toString() }} />
                <span className="font-bold">{currentServer.toUpperCase()}</span>
            </Link>
        )
    };
}