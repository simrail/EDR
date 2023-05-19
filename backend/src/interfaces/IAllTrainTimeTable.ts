export interface IAllTrainTimeTable {
	/** Format: "2023-06-19 00:49:00" */
	arrivalTime: string | null,
	/** Format: "2023-06-19 00:49:00" */
	departureTime: string | null,
	displayedTrainNumber: string,
	line: number,
	maxSpeed: number,
	mileage: number,
	nameForPerson: string,
	nameOfPoint: string,
	platform: string | null,
	pointId: string,
	/** Typo in API, format: "R2, R3, R7" or "R2" */
	radioChanels: string,
	stationCategory: 'A' | 'B' | 'C' | 'D' | 'E' | null,
	stopType: string,
	supervisedBy: string,
	track: number | null,
	trainType: string,
}
