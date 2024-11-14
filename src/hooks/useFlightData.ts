// useFlightData.ts
import { useEffect, useState } from "react";
import { FlightData } from "../types/flightData";
import { fetchFlightData } from "../api/flightsAPI";

export const useFlightData = () => {
  const [data, setData] = useState<FlightData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const result = await fetchFlightData();
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  return { data, loading, error };
};
