import { ISpeedLimit } from "./ISpeedLimit.js";

export interface ITrainTimeTable {
	indexOfPoint: number,
	nameForPerson: string,
	pointId: string,
	displayedTrainNumber: string,
	arrivalTime: string | null,
	actualArrivalTime: string | null,
	departureTime: string | null,
	actualDepartureTime: string | null,
	/** This is an actual typo in the API */
	isStoped: boolean,
	stopDuration: number,
	isActive: boolean,
	isConfirmed: boolean,
	confirmedBy: number,
	plannedStop: number,
	timetableType: number,
	/** 0 - no stop, 1 - ph (passenger stop), 2 - pt (technical stop) */
	stopTypeNumber: number,
	leftTrack: boolean,
	line: number,
	platform: string | null,
	track: number | null,
	trainType: string,
	mileage: number,
	maxSpeed: number,
	// This is not in the API, but we append it so the frontend doesn't have to query this info separately
	speedLimitsToNextStation?: ISpeedLimit[]
}
