import { useEffect, useState } from "react";
import { getStorageEstimate } from "./helper/storageEstimate";
import { StorageEstimate } from "./types/storage";

import styles from "./App.module.css"

function App() {

  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate>({ totalQuotaInGB: 0, usageInGB: 0 }); // Holds the storage estimate data

  useEffect(() => {
    const fetchStorageEstimate = async () => {
      const estimate = await getStorageEstimate();
      setStorageEstimate(estimate);
    };

    fetchStorageEstimate();
  }, []);

  return (
    <>
      <div>
        <p>Storage Estimate:</p>
        <p>Total Quota: {storageEstimate.totalQuotaInGB.toFixed(2)} GB</p>
        <p>Used: {storageEstimate.usageInGB.toFixed(2)} GB</p>

        <p>Network status: online</p>
      </div>

      <h1>Notifications here</h1>
      <button>Get Notifications</button>
    </>
  );
}

export default App;
