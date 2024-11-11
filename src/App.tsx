import { useEffect, useState } from "react";
import { getStorageEstimate } from "./helper/storageEstimate";
import { StorageEstimate } from "./types/storage";
import { saveDataToDB, getDatafromDB, deleteDataFromDB } from "./database/indexedDb";

interface DatabaseRecord {
  id: number;
  name: string;
  email: string;
}

const App = () => {
  const [storageEstimate, setStorageEstimate] = useState<StorageEstimate>({ totalQuotaInGB: 0, usageInGB: 0 });
  const [networkStatus, setNetworkStatus] = useState<boolean>(true);
  const [databaseData, setDatabaseData] = useState<DatabaseRecord[]>([]);
  const [newRecord, setNewRecord] = useState<DatabaseRecord>({ id: -1, name: "", email: "" });
  const [nextId, setNextId] = useState<number>(0);

  useEffect(() => {
    const fetchStorageEstimate = async () => {
      const estimate = await getStorageEstimate();
      setStorageEstimate(estimate);
    };

    const checkNetworkStatus = () => {
      setNetworkStatus(navigator.onLine);
    };

    const loadDataFromDB = async () => {
      const data = await getDatafromDB("myDatabase", "myTable");
      setDatabaseData(data as any);
    };

    fetchStorageEstimate();
    checkNetworkStatus();
    loadDataFromDB();
  }, [navigator.onLine]);

  // Type guard function
  function isDatabaseRecordArray(data: unknown[]): data is DatabaseRecord[] {
    return data.every((item): item is DatabaseRecord => {
      return typeof item === 'object' && item !== null && 'id' in item && 'name' in item && 'email' in item;
    });
  }

  const handleDeleteLastRecord = async () => {
    const data = await getDatafromDB("myDatabase", "myTable");

    // Type guard to ensure data is an array of DatabaseRecord objects
    if (isDatabaseRecordArray(data)) {
      const lastRecord = data[data.length - 1];
      await deleteDataFromDB("myDatabase", "myTable", lastRecord.id);
      setDatabaseData(data.slice(0, -1));
    } else {
      console.error("Error: Data returned from IndexedDB is not an array of DatabaseRecord objects.");
    }
  };

  const handleNewRecordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewRecord((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddNewRecord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await saveDataToDB("myDatabase", "myTable", [newRecord]);
    setNewRecord({ id: nextId, name: "", email: "" });
    setNextId(prevId => prevId + 1);
    const data = await getDatafromDB("myDatabase", "myTable");
    if (!isDatabaseRecordArray(data)) { return; }
    setDatabaseData(data);
  };

  return (
    <>
      <div>
        <p>Storage Estimate:</p>
        <p>Total Quota: {storageEstimate.totalQuotaInGB.toFixed(2)} GB</p>
        <p>Used: {storageEstimate.usageInGB.toFixed(2)} GB</p>

        <p>Network status: {networkStatus ? "online" : "offline"}</p>
      </div>

      <h1>Data from IndexedDB</h1>
      <ul>
        {databaseData.map((item) => (
          <li key={item.id}>
            Name: {item.name}, Email: {item.email}
          </li>
        ))}
      </ul>

      <button onClick={handleDeleteLastRecord}>Delete Last Record</button>

      <h2>Add New Record</h2>
      <form onSubmit={handleAddNewRecord}>
        <label>
          Name:
          <input type="text" name="name" value={newRecord.name} onChange={handleNewRecordChange} />
        </label>
        <label>
          Email:
          <input type="text" name="email" value={newRecord.email} onChange={handleNewRecordChange} />
        </label>
        <button type="submit">Add Record</button>
      </form>

      <h1>Notifications here</h1>
      <button>Get Notifications</button>
    </>
  );
};

export default App;