// types.ts
export interface FlightData {
    std: string;       // Standard departure time
    flight: string;    // Flight number
    route: string;     // Route in origin-destination format
    aircraft: string;  // Aircraft type
    e_etd: string;     // Estimated departure time
    o_etd: string;     // Original estimated departure time
  }
  