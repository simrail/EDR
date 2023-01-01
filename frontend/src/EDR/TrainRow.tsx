import React from "react";
import {configByType} from "./config";
import {Badge, Checkbox, Progress, Spinner, Table} from "flowbite-react";

export const TableRow: React.FC<any> = ({ttRow, timeOffset, trainDetails, currentTime}) => {
    const trainConfig = configByType[ttRow.type as string];
    const trainBadgeColor = trainConfig?.color ?? "purple";
    const currentDistance = trainDetails?.distanceToStation.slice(-1)
    const previousDistance = trainDetails?.distanceToStation.slice(-2)
    const distanceFromStation = Math.round(currentDistance * 100) / 100;
    const ETA = trainDetails?.TrainData?.Velocity ? (distanceFromStation / trainDetails.TrainData.Velocity) * 60 : undefined;
    const hasEnoughData = trainDetails?.distanceToStation.length > 2 || !trainDetails ;
    const trainHasPassedStation = hasEnoughData && currentDistance > previousDistance;
    const dateNow = new Date(Date.now());
    const [expectedHours, expectedMinutes] = ttRow.scheduled_arrival.split(":");
    const isNextDay = Math.abs(expectedHours - dateNow.getHours()) > 12; // TODO: Clunky
    // console.log("Is next day ? " + ttRow.train_number, isNextDay);
    const expectedArrival = new Date(new Date(new Date(Date.now()).setHours(expectedHours)).setMinutes(expectedMinutes));
    const timeDelay = ((isNextDay ? 1 : 0) * -1444) + ((dateNow.getHours() - expectedArrival.getHours()) * 60) + (dateNow.getMinutes() - expectedArrival.getMinutes());

    // ETA && console.log("ETA", ETA);
    return <Table.Row className="h-[92px]" style={{opacity: trainHasPassedStation ? 0.5 : 1}} data-timeoffset={timeOffset}>
        <Table.Cell>
            <div className="flex items-center justify-between">
                <Badge color={trainBadgeColor}>{ttRow.train_number}</Badge><span className="none md:inline">{trainConfig && <img src={trainConfig.icon} height={50} width={64}/>}</span>
            </div>
            <div className="w-full">
                {  distanceFromStation
                    ? <>à {distanceFromStation}km</>
                    : <>Offline</>
                }
                &nbsp;
                {
                    !hasEnoughData
                    ? undefined
                        : distanceFromStation
                        ? previousDistance == currentDistance
                            ? <>&nbsp;- A l'arret</>
                            : trainHasPassedStation ?
                                <>&nbsp;- S'eloigne</>
                                : ETA && Math.round(ETA) < 20
                                ? <>&nbsp;- {Math.round(ETA)}mn</>
                                : trainDetails?.TrainData?.Velocity === 0 ? <>&nbsp;- Arreté</> : undefined
                : undefined
                }
            {
                !hasEnoughData && <span><Spinner size="sm" /></span>
            }
                {
                    !trainHasPassedStation && timeDelay > 5 && trainDetails
                    ? <Badge className="animate-pulse duration-1000" color="failure"> Retard</Badge>
                    : undefined
                }
                {
                    !trainHasPassedStation && timeDelay < -5 && distanceFromStation < 4 &&  trainDetails
                        ? <Badge className="animate-pulse" color="info">En avance</Badge>
                        : undefined
                }
            </div>
        </Table.Cell>
        <Table.Cell className="flex justify-center items-center flex-col space-around">
            <Badge className="text-center items-center" color={trainBadgeColor}>{ttRow.type}</Badge>&nbsp;{ttRow.type_speed ?? '??'}km/h

        </Table.Cell>
        <Table.Cell>
            <div className="flex items-center justify-center h-full">
            {ttRow.scheduled_arrival}&nbsp;
                {
                    !trainHasPassedStation && timeDelay > 0 && trainDetails
                        ? <span className="text-red-700 font-bold">+{timeDelay}</span>
                        : undefined
                }

                {
                    !trainHasPassedStation && timeDelay < 0 && trainDetails
                        ? <span className="text-green-700 font-bold">{timeDelay}</span>
                        : undefined
                }
            </div>
        </Table.Cell>
        <Table.Cell>
            {ttRow.from}
        </Table.Cell>
        <Table.Cell>
            {ttRow.layover} {ttRow.stop_type} {ttRow.platform && <>({ttRow.platform})</>}
        </Table.Cell>
        <Table.Cell>
            {ttRow.scheduled_departure}
        </Table.Cell>
        <Table.Cell>
            {ttRow.to}
        </Table.Cell>
        <Table.Cell>
            {ttRow.line}
        </Table.Cell>
    </Table.Row>
}