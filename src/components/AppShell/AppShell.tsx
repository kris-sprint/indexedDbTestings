import React from 'react';
import { Link } from 'react-router-dom';
import styles from "./AppShell.module.css"

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className={styles.container}>

      {/* TODO seperate component */}
      <header className={styles.header}>
        <nav className={styles.nav}>
          <div className={styles.navContent}>
            {/* <div className={styles.logo}>My PWA</div> */}
            <div className={styles.navLinks}>
              <Link to="/" className={styles.navLink}>Home</Link>
              <Link to="/flights" className={styles.navLink}>Flights</Link>
              {/* <Link to="/profile" className={styles.navLink}>Profile</Link> */}
            </div>
          </div>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

    </div>
  );
};