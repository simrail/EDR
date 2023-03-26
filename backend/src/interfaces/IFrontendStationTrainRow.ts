export interface IFrontendStationTrainRow {
    train_number: string,
    train_type: string,
    type_speed: number,
    stop_type: number,
    platform: string | null,
    arrival_time_object: Date,
    arrival_time: string | null | undefined,
    departure_time: string | null | undefined,
    from_post: string | null | undefined,
    to_post: string | null | undefined,
    line: number,
    start_station: string,
    terminus_station: string,
    layover: number
}