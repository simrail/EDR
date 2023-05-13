export interface IAllTrainTimeTable {
	nameOfPoint: string,
	nameForPerson: string,
	pointId: string,
	supervisedBy: string,
	/** Typo in API, format: "R2, R3, R7" or "R2" */
	radioChanels: string, 
	displayedTrainNumber: string,
	/** Format: "2023-06-19 00:49:00" */
	arrivalTime: string | null,
	/** Format: "2023-06-19 00:49:00" */
	departureTime: string | null,
	stopType: string,
	line: number,
	platform: string | null,
	track: string | null,
	trainType: string,
	mileage: number,
	maxSpeed: number,
	stationCategory: 'A' | 'B' | 'C' | 'D' | 'E' | null,
}
