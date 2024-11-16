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

export class FlightDBOperations {
  /**
   * Cache flight data in the database.
   * @param flights Array of flights to cache.
   */
  static async cacheFlights(flights: FlightData[]): Promise<void> {
    try {
      await db.flights.bulkPut(flights);
    } catch (error) {
      console.error("Error caching flights:", error);
      throw error;
    }
  }

  /**
   * Retrieve all cached flights from the database.
   * @returns Array of cached flights.
   */
  static async getCachedFlights(): Promise<FlightData[]> {
    try {
      return await db.flights.toArray();
    } catch (error) {
      console.error("Error getting cached flights:", error);
      throw error;
    }
  }

  /**
   * Remove flights older than a cutoff time (24 hours).
   */
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

  /**
   * Synchronize the local cache with server data.
   * @param serverFlights Array of flights fetched from the server.
   */
  static async synchronizeCache(serverFlights: FlightData[]): Promise<void> {
    try {
      const serverFlightIds = new Set(serverFlights.map((flight) => flight.flight));

      // Remove flights from the cache that are not present on the server
      await db.flights.where("flight").noneOf([...serverFlightIds]).delete();

      // Add or update flights from the server
      await this.cacheFlights(serverFlights);
    } catch (error) {
      console.error("Error synchronizing cache:", error);
      throw error;
    }
  }

  /**
   * Handle fetching flight data with cache-first and synchronization strategies.
   * @param request The network request for flight data.
   * @returns A Response object containing either cached or fetched data.
   */
  static async handleFlightDataFetch(request: Request): Promise<Response> {
    try {
      // Get cached data
      const cachedFlights = await this.getCachedFlights();
      console.log("Cached flights:", cachedFlights);

      // Start network fetch
      const networkPromise = fetch(request)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          // Parse the server response
          const flights: FlightData[] = await response.clone().json();
          console.log("Fetched flights:", flights);

          // Synchronize the cache with server data
          await this.synchronizeCache(flights);

          // Return the original response
          return response;
        })
        .catch((error) => {
          console.error("Network fetch failed:", error);
          throw error;
        });

      // If cached data exists, return it immediately
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

      // If no cached data, wait for the network response
      return await networkPromise;
    } catch (error) {
      console.error("Error handling flight data fetch:", error);
      throw error;
    }
  }
}
