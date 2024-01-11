import { getDistanceFromLatLonInKm } from "../services/HelperFunctions";

test("check the distance calculator", async () => {
    const lat1 = 40.7128;
    const lon1 = -74.006;
    const lat2 = 34.0522;
    const lon2 = -118.2437;
    const distance = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
    const expected = 3935.746254609722;
    expect(distance).toBe(expected);
});
