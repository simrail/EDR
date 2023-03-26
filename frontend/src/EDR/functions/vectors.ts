import Victor from "victor";

export function haversine(coords1: [number, number], coords2: [number, number], isMiles: boolean = false) {
    function toRad(x: number) {
        return x * Math.PI / 180;
    }

    // console_log(coords1, coords2);
    const lon1 = coords1[0];
    const lat1 = coords1[1];

    const lon2 = coords2[0];
    const lat2 = coords2[1];

    const R = 6371; // km

    const x1 = lat2 - lat1;
    const dLat = toRad(x1);
    const x2 = lon2 - lon1;
    const dLon = toRad(x2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    if(isMiles) d /= 1.60934;

    return d;
}

// TODO: Dot product is not enough, it should be a normal vector

export const Vector_DotProduct = (a: [number, number], b: Victor) => {
    const vecA = Victor.fromArray(a);
    return vecA.dot(b);
}