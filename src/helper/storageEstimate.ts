export const getStorageEstimate = async (): Promise<{ totalQuotaInGB: number; usageInGB: number; quotaInMB: number | string }> => {
  const estimate = await navigator.storage.estimate();

  const quotaInMB = estimate.quota ? (estimate.quota / 1024 / 1024).toFixed(2) : 0;
  const totalQuotaInGB = estimate.quota ? estimate.quota / (1024 * 1024 * 1024) : 0; // Fallback to 0 if undefined
  const usageInGB = estimate.usage ? estimate.usage / (1024 * 1024 * 1024) : 0; // Fallback to 0 if undefined

  return {
    totalQuotaInGB,
    usageInGB,
    quotaInMB,
  };
};
