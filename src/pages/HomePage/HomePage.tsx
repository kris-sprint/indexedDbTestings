import React, { useState, useEffect } from 'react';
import { getToken, onMessage, deleteToken } from "@firebase/messaging";
import styles from './HomePage.module.css';

import { messaging } from "../../config/firebase";

const PUBLIC_VAPID_KEY = 'YOUR_PUBLIC_VAPID_KEY'; // Optional, from Firebase settings

const Home: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ title: string; body: string } | null>(null);
  const [showToken, setShowToken] = useState(() => {
    // Initialize from localStorage
    const savedState = localStorage.getItem('showToken');
    return savedState === null ? true : JSON.parse(savedState);
  });

  useEffect(() => {
    // Save `showToken` state to localStorage whenever it changes
    localStorage.setItem('showToken', JSON.stringify(showToken));
  }, [showToken]);

  useEffect(() => {
    // Check if the user is already subscribed
    const checkSubscription = async () => {
      try {
        // Get the service worker registration
        const registration = await navigator.serviceWorker.getRegistration();

        if (registration) {
          // Get the FCM token using the service worker registration
          const token = await getToken(messaging, { serviceWorkerRegistration: registration });
          setIsSubscribed(!!token);
          setFcmToken(token);
        }
      } catch (error) {
        console.error('Error checking FCM subscription:', error);
        setIsSubscribed(false);
      }
    };

    checkSubscription();

    // Handle incoming messages while app is in the foreground
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      setNotification({
        title: payload.notification?.title || "Notification",
        body: payload.notification?.body || "No body",
      });
    });

    return () => unsubscribe();
  }, []);

  const toggleNotificationSubscription = async () => {
    if (isSubscribed) {
      // Unsubscribe by deleting the token
      try {
        if (fcmToken) {
          await deleteToken(messaging);
          console.log("FCM token deleted, unsubscribed from notifications.");
          setIsSubscribed(false);
          setFcmToken(null);

          // TODO: Inform your backend about the unsubscription if needed
        }
      } catch (error) {
        console.error("Error unsubscribing from notifications:", error);
      }
    } else {
      // Subscribe by requesting a new token
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Get the service worker registration
          const registration = await navigator.serviceWorker.getRegistration();

          if (registration) {
            const token = await getToken(messaging, { serviceWorkerRegistration: registration });
            if (token) {
              console.log("Subscribed to FCM notifications. Token:", token);
              setFcmToken(token);
              setIsSubscribed(true);

              // TODO: Send token to your backend for subscription
            }
          }
        } else {
          console.log("Notification permission denied.");
        }
      } catch (error) {
        console.error("Error subscribing to notifications:", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1>Home Page</h1>

      {/* Notification Toggle */}
      <div className={styles.switchContainer}>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={isSubscribed}
            onChange={toggleNotificationSubscription}
          />
          <span className={styles.slider}></span>
        </label>
      </div>

      {/* Display the FCM Token */}
      {fcmToken && showToken && (
        <div>
          <h3>Your FCM Token:</h3>
          <textarea readOnly value={fcmToken} rows={4} cols={50} />
          <button
            className={styles.hideButton}
            onClick={() => setShowToken(false)}
          >
            Hide Token
          </button>
        </div>
      )}

      {/* Show notification payload */}
     
    </div>
  );
};

export default Home;
