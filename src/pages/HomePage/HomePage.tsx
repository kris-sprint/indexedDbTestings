import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';

const PUBLIC_VAPID_KEY = 'BPtb20nD1iB9qC1bevoVFwWp0-0eqpDZ-PwOep7O8jUkXAt34Ek5Wl1IJaSLGTJVZUKlE8L0RiXHUEPen8Sp9-Y'; // Replace with your actual VAPID public key

const Home: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed
    const checkSubscription = async () => {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    };
    checkSubscription();
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const toggleNotificationSubscription = async () => {
    const registration = await navigator.serviceWorker.ready;

    if (isSubscribed) {
      // Unsubscribe if already subscribed
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log('User unsubscribed from push notifications');
        setIsSubscribed(false);
      }
    } else {
      try {
        // Request permission for notifications
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Subscribe user to push notifications
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
          });

          console.log('subscription', subscription)

          // Send the subscription to the backend to register with SNS
          // await sendSubscriptionToBackend(subscription);
          setIsSubscribed(true);
        } else {
          console.log('Notification permission not granted.');
        }
      } catch (error) {
        console.error('Failed to subscribe to push notifications:', error);
      }
    }
  };

  const sendSubscriptionToBackend = async (subscription: PushSubscription) => {
    // Replace with your API endpoint to store the subscription
    await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Home Page</h1>
      <button onClick={toggleNotificationSubscription} className={styles.button}>
        {isSubscribed ? 'Disable Notifications' : 'Enable Notifications'}
      </button>
    </div>
  );
};

export default Home;
