import { useEffect, useState } from 'react';
import socket from '../sockets/socket';

export const useSocket = (userId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit('joinUserRoom', userId);

    socket.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      // Mund të shtosh edhe një tingull
      new Audio('/notification.mp3').play().catch(() => {});
    });

    return () => socket.disconnect();
  }, [userId]);

  return notifications;
};