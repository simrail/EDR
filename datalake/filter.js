const redis = require("redis");
const _ = require("lodash");
const geojson = require("geojson");
const fs = require("fs");
const turf = require("turf");

const client = redis.createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

function haversineDistance(coords1, coords2, isMiles) {
    function toRad(x) {
        return x * Math.PI / 180;
    }

    // console.log(coords1, coords2);
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

const haversineAndFilterPointsBelow = (ary) => {

    // console.log("ary", ary[0]);
    // Calculate haversine
    return withHaversineTestedTrains =
        ary.reduce((acc, v, i) => {

            return [
                ...acc,
                i !== ary.length - 1 ? [...v, haversineDistance(ary[i + 1], v)] : [...v, 0]
            ];
        }, [])
    .filter((v) => v[2] !== 0);
}

async function a() {
    await client.connect();
    const trainsFR1 = await client.HGETALL("trains_fr1");

    const treatedTrains = _.sortBy(
        Object.values(trainsFR1)
        .map(JSON.parse)
        .flatMap((serverTrainData) => serverTrainData.map((t) => [t.TrainData.Latititute, t.TrainData.Longitute])),
    (point) => point[0] + point[1]);

    let subSets = treatedTrains; // []
    /*for (let i = 0; i < (treatedTrains.length -1 ) / 20; i++) {
        subSets[i] = treatedTrains[i * 20];
    }*/
    const nonZeroPoints = haversineAndFilterPointsBelow(subSets);
    console.log("1", nonZeroPoints);

    let filterExtremePoints = [];
    let extremePoints = [];

    for (let i = 0; i < nonZeroPoints.length - 1; i++) {
        if (nonZeroPoints[i][2] > 0.5) {
            extremePoints.push(nonZeroPoints[i]);
        } else {
            filterExtremePoints.push([nonZeroPoints[i][0], nonZeroPoints[i][1]]);
        }
    }

    console.log(filterExtremePoints);
    let a = haversineAndFilterPointsBelow(filterExtremePoints);

    console.log(a);
    filterExtremePoints = [];
    extremePoints = [];
    for (let i = 0; i < a.length - 1; i++) {
        if (a[i] && a[i][2] > 0.5) {
            extremePoints.push(nonZeroPoints[i]);
        } else {
            filterExtremePoints.push(nonZeroPoints[i]);
        }
    }

    const json = geojson.parse(filterExtremePoints, {Point: ['0', '1']})

    let turfLine = turf.lineString(a)

    console.log(json);

    fs.writeFileSync("result.json", JSON.stringify(json, '  '));
}
a();
