import {getTimeDelay} from "../timeUtils";
describe("Time utils", () => {
    it("Calculates a simple delay on the same day", () => {
        const dateNow = new Date(2009, 12, 31, 23, 15);
        const dateExpected = new Date(2009, 12, 31, 23, 25);
        const delayTime = getTimeDelay(false, false, dateExpected, dateNow);
        expect(delayTime).toBe(10);
    })

    it("Calculates an earlyness when the now is in next day and expected is previous day", () => {
        const dateNow =  new Date(2010, 1, 2, 0, 15);
        const dateExpected = new Date(2010, 1, 1, 23, 15);
        const delayTime = getTimeDelay(true, false, dateNow, dateExpected);
        expect(delayTime).toBe(60);
    })

    it("Calculates a delay when the now is in previous day and expected is next day", () => {
        const dateNow = new Date(2010, 1, 1, 23, 15);
        const dateExpected = new Date(2010, 1, 2, 0, 15);
        const delayTime = getTimeDelay(true, false, dateNow, dateExpected);
        expect(delayTime).toBe(-60);
    })

    it("Calculates a no delay no lateness when the now is in previous day and expected is previous day too", () => {
        const dateNow = new Date(2010, 1, 1, 22, 15);
        const dateExpected = new Date(2010, 1, 2, 22, 15);
        const delayTime = getTimeDelay(true, false, dateNow, dateExpected);
        expect(delayTime).toBe(0);
    })

    it("Calculates a no delay no lateness when the now is in next day and expected is next day too", () => {
        const dateNow = new Date(2010, 1, 1, 22, 15);
        const dateExpected = new Date(2010, 1, 2, 22, 15);
        const delayTime = getTimeDelay(true, false, dateNow, dateExpected);
        expect(delayTime).toBe(0);
    })
})