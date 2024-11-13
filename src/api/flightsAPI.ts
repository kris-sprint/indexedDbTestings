import { FlightData } from "../types/flightData";

// const BASE_URL = import.meta.env.BASE_URL;
const BASE_URL = 'https://yllqzm0ix8.execute-api.eu-west-1.amazonaws.com/test';

export const fetchFlightData = async (): Promise<FlightData[]> => {
  try {
    console.log('BASE_URL', BASE_URL);
    const response = await fetch(`${BASE_URL}/get-data`, {
      method: "GET"
    }); // Update with the correct endpoint URL if needed
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data: FlightData[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching flight data:", error);
    throw error; // Propagate the error to be handled by the calling function
  }
};
