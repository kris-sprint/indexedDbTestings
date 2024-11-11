export const openDatabase = async (dbName: string, tableName: string, keyPath: string = "id"): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(tableName)) {
        db.createObjectStore(tableName, { keyPath: keyPath });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveDataToDB = async (dbName: string, tableName: string, data: unknown[]) => {
  const db = await openDatabase(dbName, tableName);
  const transaction = db.transaction(tableName, "readwrite");
  const store = transaction.objectStore(tableName);

  data.forEach((record) => store.put(record));

  return transaction.oncomplete;
};

export const getDatafromDB = async (dbName: string, tableName: string): Promise<unknown[]> => {
  const db = await openDatabase(dbName, tableName);
  const transaction = db.transaction(tableName, "readonly");
  const store = transaction.objectStore(tableName);

  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
