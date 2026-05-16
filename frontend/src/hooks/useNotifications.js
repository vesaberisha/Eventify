import { useState, useEffect } from 'react';
import socket from '../sockets/socket';

export const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    socket.connect();
    socket.emit('joinUserRoom', userId);

    socket.on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Tingull notification
      const audio = new Audio('https://freesound.org/data/previews/66/66930_931655-lq.mp3');
      audio.play().catch(() => {});
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  const markAsRead = () => setUnreadCount(0);

  return { notifications, unreadCount, markAsRead };
};