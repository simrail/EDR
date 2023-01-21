import {BASE_API_URL} from "../api";

describe("Invalid configuration will not ship to production", () => {
    it("Base API URL is not localhost", () => {
        expect(BASE_API_URL).not.toBe("http://localhost:8080/")
    })
});