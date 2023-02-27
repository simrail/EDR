import _ from "lodash";
import {all} from "axios";
import {internalIdToSrId, verboseStopTypeToStationStopType, VMAX_BY_TYPE} from "./config";


function translateTrainRowToStationRow(trainRow: any) {
    return {
        train_number: trainRow.displayedTrainNumber,
        train_type: trainRow.trainType,
        stop_type: verboseStopTypeToStationStopType[trainRow.stopType],
        type_speed: VMAX_BY_TYPE[trainRow.trainType],
        platform: trainRow.platform,
        track: trainRow.track,
        arrival_time: trainRow.arrivalTime.split(" ")[1],
        // departure_time


    }
}
export async function fetchTimetableDataAndWriteIt() {
    console.log("Fetching data from Simrail API");
    const allTimetables = await fetch("https://api1.aws.simrail.eu:8082/api/getAllTimetables?serverCode=fr1").then((res) => res.json());
    console.log("Done");
    (global as any).trainData = Object.fromEntries(Object.entries(_.groupBy(allTimetables, "trainNoLocal")).map(([k, v]) => [k, v[0]]));
    console.log("Train data: ", (global as any).trainData);
    console.log("Train data written");
    console.log("Writting timetable data ...")
    const allKnownStations = Object.values(internalIdToSrId);
    const flattenTT = allTimetables
        .flatMap((v: any) => v.timetable)
        .filter((v: any) => allKnownStations.includes(v.nameOfPoint))
    console.log("Flatten timetables : ", flattenTT);
    (global as any).stationsTimetables = flattenTT;

}


const refreshIntevalId = setInterval(() => {
    fetchTimetableDataAndWriteIt();
}, 60 * 1000 * 1000);