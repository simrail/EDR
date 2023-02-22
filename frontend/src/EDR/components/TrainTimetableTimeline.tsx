import React from 'react';

type Props = {
    itemIndex: number;
    closestStationIndex: number;
    isAtTheStation: boolean;
}

const TrainTimetableTimeline: React.FC<Props> = ({ itemIndex, closestStationIndex, isAtTheStation }) => {
    return (
        <>
            <div className={`absolute w-1 h-1/2 ${itemIndex <= closestStationIndex ? 'bg-slate-500 dark:bg-slate-500' : 'bg-slate-300'} top-0 left-1 dark:bg-slate-700`}></div>
            {itemIndex !== 0 && (
                <div className={`absolute w-1 h-1/2 ${itemIndex <= closestStationIndex ? 'bg-slate-500 dark:bg-slate-500' : 'bg-slate-300'} -top-1/2 left-1 dark:bg-slate-700`}></div>
            )}
            <div className={`absolute w-4 h-4 ${itemIndex <= closestStationIndex ? 'bg-slate-500' : 'bg-slate-300'} rounded-full top-1/2 -translate-y-1/2 -left-0.5 border-2 border-white dark:border-gray-900 dark:bg-gray-700 z-10`}></div>
            {isAtTheStation && (
                <div className="absolute w-3 h-3 bg-green-400 rounded-full top-1/2 -translate-y-1/2 left-0 dark:bg-gray-700 z-10"></div>
            )}
        </>
    )
}

export default TrainTimetableTimeline;