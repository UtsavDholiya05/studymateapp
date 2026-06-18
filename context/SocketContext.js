import React, { createContext, useContext, useState, useEffect } from "react";
import socket from "../services/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const SocketContext = createContext();

// Configure local notifications handler
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.log("Error configuring local notifications handler:", e);
}

export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);

  // Load notifications from AsyncStorage on mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem("@group_notifications");
        if (stored) {
          setNotifications(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error loading notifications:", e);
      }
    };

    loadNotifications();

    // Connect socket on app mount
    socket.connect();

    // Request notification permissions
    const requestPermissions = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Notification permission not granted");
        }
      } catch (e) {
        console.log("Error requesting notification permissions:", e);
      }
    };
    requestPermissions();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Save notifications whenever they update
  useEffect(() => {
    const saveNotifications = async () => {
      try {
        await AsyncStorage.setItem("@group_notifications", JSON.stringify(notifications));
      } catch (e) {
        console.error("Error saving notifications:", e);
      }
    };
    saveNotifications();
  }, [notifications]);

  // Handle incoming group messages globally
  useEffect(() => {
    const handleGroupMessage = async ({ groupId, groupName, message }) => {
      try {
        const chatKey = `@group_chat_${groupId}`;
        const saved = await AsyncStorage.getItem(chatKey);
        const chatMessages = saved ? JSON.parse(saved) : [];

        // Save new message locally if not duplicate
        if (!chatMessages.some((m) => m.id === message.id)) {
          const updatedMessages = [...chatMessages, message];
          await AsyncStorage.setItem(chatKey, JSON.stringify(updatedMessages));
        }
      } catch (e) {
        console.error("Error storing received message locally:", e);
      }

      // Check if user is in this active chat group screen
      // If not, generate a notification
      if (String(activeGroupId) !== String(groupId)) {
        const newNotif = {
          id: message.id || Date.now().toString(),
          groupId: String(groupId),
          groupName,
          senderName: message.senderName,
          text: message.text,
          timestamp: message.timestamp || new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          avatar: message.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
          read: false,
        };

        setNotifications((prev) => [newNotif, ...prev]);

        // Fire a local OS push alert
        try {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `New message in ${groupName}`,
              body: `${message.senderName}: ${message.text}`,
              data: { groupId, groupName },
            },
            trigger: null,
          });
        } catch (e) {
          console.log("Could not schedule system push notification:", e);
        }
      }
    };

    socket.on("group_message", handleGroupMessage);
    return () => {
      socket.off("group_message", handleGroupMessage);
    };
  }, [activeGroupId]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <SocketContext.Provider
      value={{
        notifications,
        activeGroupId,
        setActiveGroupId,
        markAllAsRead,
        clearAllNotifications,
        markAsRead,
        deleteNotification,
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
