import React, { ReactNode } from "react";

export interface SubNavigationProps {
    navPreviousItem?: ReactNode | undefined;
    navNextItem?: ReactNode | undefined;
    navCurrentItem?: ReactNode | undefined;
}

const SubNavigation: React.FC<SubNavigationProps> = (props) => {
    const { navPreviousItem, navCurrentItem, navNextItem } = props;

    return (
        <div className="bg-slate-100 dark:bg-gray-900 px-2 py-2.5 dark:border-gray-700 dark:bg-gray-800 sm:px-4 sticky top-20 columns-3 justify-center flex">
            <div className="w-full flex">
                {navPreviousItem && navPreviousItem}
            </div>
            <div className="w-full justify-center flex">
                {navCurrentItem && navCurrentItem}
            </div>
            <div className="w-full flex">
                {navNextItem && navNextItem}
            </div>
        </div>
    )
}

export default SubNavigation;