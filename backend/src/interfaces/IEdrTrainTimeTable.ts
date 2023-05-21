import { ISpeedLimit } from "./ISpeedLimit.js";

export interface IEdrTrainTimeTable {
	actualArrivalTime: string | null,
	actualDepartureTime: string | null,
	arrivalTime: string | null,
	confirmedBy: number,
	departureTime: string | null,
	displayedTrainNumber: string,
	indexOfPoint: number,
	isActive: boolean,
	isConfirmed: boolean,
	/** This is an actual typo in the API */
	isStoped: boolean,
	leftTrack: boolean,
	line: number,
	maxSpeed: number,
	mileage: number,
	nameForPerson: string,
	plannedStop: number,
	platform: string | null,
	pointId: string,
	// This is not in the API, but we append it so the frontend doesn't have to query this info separately
	speedLimitsToNextStation?: ISpeedLimit[],
	stopDuration: number,
	/** 0 - no stop, 1 - ph (passenger stop), 2 - pt (technical stop) */
	stopTypeNumber: number,
	timetableType: number,
	track: number | null,
	trainType: string,
}
