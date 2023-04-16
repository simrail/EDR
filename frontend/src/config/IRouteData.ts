export interface IRouteData {
    code: string,
    routes: {
        distance: number,
        duration: number,
        legs: {
            distance: number,
            duration: number,
            steps: [],
            summary: string,
            weight: number,
        }[],
        weight: number,
        weight_name: string,
    }[],
    waypoints: {
        distance: number,
        hint: string,
        location: [number, number],
        name: string,
    }[],
}
