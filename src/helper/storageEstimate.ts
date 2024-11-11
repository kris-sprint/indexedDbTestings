export const getStorageEstimate = async (): Promise<{ totalQuotaInGB: number; usageInGB: number }> => {
  const estimate = await navigator.storage.estimate();

  const totalQuotaInGB = estimate.quota ? estimate.quota / (1024 * 1024 * 1024) : 0; // Fallback to 0 if undefined
  const usageInGB = estimate.usage ? estimate.usage / (1024 * 1024 * 1024) : 0; // Fallback to 0 if undefined

  return {
    totalQuotaInGB,
    usageInGB,
  };
};
