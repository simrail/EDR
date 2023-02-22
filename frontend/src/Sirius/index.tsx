import React from "react";
import {useParams} from "react-router-dom";

const Sirius = () => {
    const [trainTimetable, setTrainTimetable] = React.useState<any | undefined>();
    const {trainNumber} = useParams();
    React.useEffect(() => {
        (trainNumber)
    }, [trainNumber])
    console.log("Train number : ", trainNumber)
    return null;
}

export default Sirius;
