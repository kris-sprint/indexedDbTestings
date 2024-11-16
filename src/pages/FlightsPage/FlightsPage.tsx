import FlightDataTable from "../../components/FlightsDataTable/FlightsDataTable";
import { fetchFlightData } from "../../api/flightsAPI";
import { FlightData } from "../../types/flightData";
import styles from "./FlightsPage.module.css"
import { useEffect, useState } from "react";

const FlightsPage = () => {

  const [flightData, setFlightData] = useState<FlightData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchFlightData();
      console.log('hook data', data);
      setFlightData(data);
    }

    fetchData();
  }, [])

  return (
    <div className={styles.container}>
      <h1>
        Flight Information
      </h1>

      <FlightDataTable data={flightData} />
    </div>
  );
}

export default FlightsPage;