import Dexie from "dexie";
import { FlightData } from "../types/flightData";

export class FlightDatabase extends Dexie {
  flights!: Dexie.Table<FlightData, string>;

  constructor() {
    super("FlightDB");
    this.version(1).stores({
      flights: "flight, std, route",
    });
  }
}

export const db = new FlightDatabase();

// export const cacheFlights = async (flights: FlightData[]): Promise<void> => {
//   try {
//     await db.flights.bulkPut(flights);
//   } catch (error) {
//     console.error("Error caching flights:", error);
//     throw error;
//   }
// };

export class FlightDBOperations {
  static async cacheFlights(flights: FlightData[]): Promise<void> {
    try {
      await db.flights.bulkPut(flights);
    } catch (error) {
      console.error("Error caching flights:", error);
      throw error;
    }
  }

  static async getCachedFlights(): Promise<FlightData[]> {
    try {
      return await db.flights.toArray();
    } catch (error) {
      console.error("Error getting cached flights:", error);
      throw error;
    }
  }

  static async cleanOldFlights(): Promise<void> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - 24);

      await db.flights.where("std").below(cutoffTime.toISOString()).delete();
    } catch (error) {
      console.error("Error cleaning old flights:", error);
      throw error;
    }
  }

  static async handleFlightDataFetch(request: Request): Promise<Response> {
    try {
      // Get cached data first
      const cachedFlights = await this.getCachedFlights();
      console.log("cachedFlights", cachedFlights);

      // Start network fetch
      console.log("request", request);
      const networkPromise = fetch(request)
        .then(async (response) => {
          if (response.ok) {
            console.log("response", response);
            const flights: FlightData[] = await response.clone().json();
            console.log('flights', flights)
            // Cache the new data
            await this.cacheFlights(flights);
            // Clean old data
            // await this.cleanOldFlights();
            return response;
          }
          throw new Error("Network response was not ok");
        })
        .catch((error) => {
          console.error("Network fetch failed:", error);
          throw error;
        });

      // If we have cached data, return it immediately
      if (cachedFlights.length > 0) {
        // Revalidate cache in the background
        networkPromise.catch(console.error);

        return new Response(JSON.stringify(cachedFlights), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Source": "dexie-db",
          },
        });
      }

      // If no cached data, wait for network response
      return await networkPromise;
    } catch (error) {
      console.error("Error handling flight data fetch:", error);
      throw error;
    }
  }
}
