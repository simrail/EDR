import React from 'react';

type Props = {
    itemIndex: number;
    closestStationIndex: number;
    isAtTheStation: boolean;
    renderOnlyLine?: boolean;
    stopType?: number;
}

const TrainTimetableTimeline: React.FC<Props> = ({ itemIndex, closestStationIndex, isAtTheStation , renderOnlyLine = false, stopType}) => {
    return (
        <>
            {itemIndex !== 0 && (
                <>
                    <div className={`absolute w-1 h-1/2 ${itemIndex <= closestStationIndex ? 'bg-slate-500 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-600'} top-0 left-2.5`}></div>
                    <div className={`absolute w-1 h-1/2 ${itemIndex <= closestStationIndex ? 'bg-slate-500 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-600'} -top-[45%] left-2.5`}></div>
                </>
            )}
            {!renderOnlyLine && <>
                {(stopType || 0) > 0 && <div className={`absolute w-4 h-4 ${itemIndex <= closestStationIndex ? 'bg-slate-500 dark:bg-slate-200' : 'bg-slate-300 dark:bg-slate-600'} left-1 rounded-full top-1/2 -translate-y-1/2 border-2 ${itemIndex % 2 ? 'border-gray-50 dark:border-gray-700' : 'border-white dark:border-gray-800' } z-10`}></div>}
                {isAtTheStation && (
                    <span className="flex h-4 w-4 absolute left-1 top-1/2 -translate-y-1/2 z-10">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-400"></span>
                    </span>
                )}
                </>
            }
        </>
    )
}

export default TrainTimetableTimeline;