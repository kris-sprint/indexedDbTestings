import React from "react";
import { NavLink } from "react-router-dom";  // Import NavLink
import styles from "./AppShell.module.css";

import { MdHome } from "react-icons/md";
import { BiSolidHome } from "react-icons/bi";
import { BiSolidPlaneAlt } from "react-icons/bi";
import { BsFillBookmarkFill } from "react-icons/bs";
import { BsChatLeftTextFill } from "react-icons/bs";

import EasyJetLogo from '../../assets/EasyJet_logo.svg';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* TODO separate component */}
      <header className={styles.header}>
      <img src={EasyJetLogo} alt="easyJet logo" className={styles.logo} />
      </header>

      <main className={styles.main}>{children}</main>

      <nav className={styles.nav}>
        <div className={styles.navLinks}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLinkItem} ${styles.active}` : styles.navLinkItem
            }
          >
            <BiSolidHome />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/flights"
            className={({ isActive }) =>
              isActive ? `${styles.navLinkItem} ${styles.active}` : styles.navLinkItem
            }
          >
            <BiSolidPlaneAlt />
            <span>Flights</span>
          </NavLink>

          <NavLink
            to="/tracked"
            className={({ isActive }) =>
              isActive ? `${styles.navLinkItem} ${styles.active}` : styles.navLinkItem
            }
          >
            <BsFillBookmarkFill />
            <span>Tracked</span>
          </NavLink>

          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive ? `${styles.navLinkItem} ${styles.active}` : styles.navLinkItem
            }
          >
            <BsChatLeftTextFill />
            <span>Chat</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};
