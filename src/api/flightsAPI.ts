import { FlightData } from "../types/flightData";

interface SubscriptionResponse {
  msg: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

export const subscribeToNotifications = async (token: string): Promise<SubscriptionResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe');
    }

    const data: SubscriptionResponse = await response.json();
    console.log('Successfully subscribed:', data.msg);
    return data;
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    throw error;
  }
};