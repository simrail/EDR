import React from "react";
import {getTimetable} from "../api/getTimetable";
import {Spinner} from "flowbite-react";
import {EDRTable} from "./Table";

export const EDR: React.FC = () => {
    const [timetable, setTimetable] = React.useState<any | undefined>();
    React.useEffect(() => {
        getTimetable("fr1", "Katowice_Zawodzie" /*"Sosnowiec_Główny"*/).then(setTimetable);
    }, []);

    console.log("Timetable data : ", timetable);

    if (!timetable)
        return <div className="h-screen flex justify-center align-center text-center">
            <Spinner size="xl" />
        </div>

    return <EDRTable timetable={timetable} />;
}

