import React from 'react';
import styles from "./LoadingFallback.module.css"

export const LoadingFallback: React.FC = () => (
  <div className={styles.loading}>
    <div className={styles.spinner} />
  </div>
);