import React from 'react';
import styles from "./HomePage.module.css"

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Home Page</h1>
    </div>
  );
};

export default Home;