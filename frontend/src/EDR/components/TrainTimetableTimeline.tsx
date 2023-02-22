import React from 'react';

type Props = {
    itemIndex: number;
    closestStationIndex: number;
    isAtTheStation: boolean;
}

const TrainTimetableTimeline: React.FC<Props> = ({ itemIndex, closestStationIndex, isAtTheStation }) => {
    return (
        <>
            <div className={`absolute w-1 h-1/2 ${itemIndex <= closestStationIndex ? 'bg-slate-500 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-600'} top-0 left-1.5`}></div>
            {itemIndex !== 0 && (
                <div className={`absolute w-1 h-1/2 ${itemIndex <= closestStationIndex ? 'bg-slate-500 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-600'} -top-1/2 left-1.5`}></div>
            )}
            <div className={`absolute w-4 h-4 ${itemIndex <= closestStationIndex ? 'bg-slate-500 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-600'} left-0 rounded-full top-1/2 -translate-y-1/2 -left-0.5 border-2 border-white dark:border-slate-700 z-10`}></div>
            {isAtTheStation && (
                <div className="absolute w-4 h-4 bg-green-400 border-2 border-green-300 rounded-full top-1/2 -translate-y-1/2 left-0 z-10 dark:bg-green-500 dark:border-green-400"></div>
            )}
        </>
    )
}

export default TrainTimetableTimeline;