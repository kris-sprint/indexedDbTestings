import React from 'react';
import { FlightData } from '../../types/flightData';
import styles from './FlightsDataTable.module.css';

interface FlightDataTableProps {
  data: FlightData[];
}

const FlightDataTable: React.FC<FlightDataTableProps> = ({ data }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell}>STD</th>
          <th className={styles.headerCell}>Flight</th>
          <th className={styles.headerCell}>Route</th>
          <th className={styles.headerCell}>Aircraft</th>
          <th className={styles.headerCell}>E-ETD</th>
          <th className={styles.headerCell}>O-ETD</th>
        </tr>
      </thead>
      <tbody>
        {data.map((flight, index) => (
          <tr key={index} className={styles.row}>
            <td className={styles.cell}>
              {new Date(flight.std).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </td>

            <td className={styles.cell}>{flight.flight}</td>
            <td className={styles.cell}>{flight.route}</td>
            <td className={styles.cell}>{flight.aircraft}</td>
            
            <td className={styles.cell}>
              {new Date(flight.e_etd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </td>
            <td className={styles.cell}>
              {new Date(flight.o_etd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FlightDataTable;
