import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSocket } from "../context/SocketContext";

const { width } = Dimensions.get("window");

const initialChats = [
  {
    id: "1",
    name: "Sarah Smiths",
    lastMessage: "Are you ready for the math test?",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    unreadCount: 2,
    isGroup: false,
  },
  {
    id: "2",
    name: "Web Dev Team",
    lastMessage: "Sarah: Hey everyone! Let's study together",
    avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=120&auto=format&fit=crop&q=80",
    unreadCount: 1,
    isGroup: true,
    groupId: "2",
  },
  {
    id: "3",
    name: "AI Study Group",
    lastMessage: "Sarah: Hey everyone! Let's study together",
    avatar: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=120&auto=format&fit=crop&q=80",
    unreadCount: 0,
    isGroup: true,
    groupId: "1",
  },
  {
    id: "4",
    name: "John Doe",
    lastMessage: "Can you send the chemistry pdf?",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    unreadCount: 0,
    isGroup: false,
  },
  {
    id: "5",
    name: "Emma Watson",
    lastMessage: "Thanks for the notes!",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    unreadCount: 0,
    isGroup: false,
  },
];

const Notification = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState(initialChats);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSegment, setActiveSegment] = useState("notifications");

  const {
    notifications,
    markAllAsRead,
    clearAllNotifications,
    markAsRead,
  } = useSocket();

  // Load last messages dynamically on focus
  useEffect(() => {
    const loadLastMessages = async () => {
      try {
        const updatedChats = await Promise.all(
          initialChats.map(async (chat) => {
            if (chat.isGroup) {
              const saved = await AsyncStorage.getItem(`@group_chat_${chat.groupId}`);
              if (saved) {
                const messages = JSON.parse(saved);
                if (messages.length > 0) {
                  const lastMsg = messages[messages.length - 1];
                  return {
                    ...chat,
                    lastMessage: `${lastMsg.senderName}: ${lastMsg.text}`,
                    time: lastMsg.timestamp || chat.time,
                  };
                }
              }
            } else {
              const saved = await AsyncStorage.getItem(`@chat_${chat.name}`);
              if (saved) {
                const messages = JSON.parse(saved);
                if (messages.length > 0) {
                  const lastMsg = messages[messages.length - 1];
                  const prefix = lastMsg.fromMe ? "You: " : "";
                  return {
                    ...chat,
                    lastMessage: `${prefix}${lastMsg.text}`,
                    time: lastMsg.time || chat.time,
                  };
                }
              }
            }
            return chat;
          })
        );
        setChats(updatedChats);
      } catch (e) {
        console.error("Error loading last messages:", e);
      }
    };

    loadLastMessages();
    const unsubscribe = navigation.addListener("focus", loadLastMessages);
    return unsubscribe;
  }, [navigation]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (item) => {
    // Reset unread count on press
    setChats(
      chats.map((c) => (c.id === item.id ? { ...c, unreadCount: 0 } : c))
    );

    if (item.isGroup) {
      navigation.navigate("groupchat", {
        groupId: item.groupId,
        groupName: item.name,
        groupOwner: "Sarah",
      });
    } else {
      navigation.navigate("ChatScreen", {
        user: item.name,
        avatar: item.avatar,
      });
    }
  };

  const handleNotificationPress = (item) => {
    markAsRead(item.id);
    navigation.navigate("groupchat", {
      groupId: item.groupId,
      groupName: item.groupName,
      groupOwner: "Sarah",
    });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 0.8,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
      }}
      onPress={() => handleChatPress(item)}
    >
      {/* Avatar */}
      <Image
        source={{ uri: item.avatar }}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          marginRight: 14,
        }}
      />

      {/* Info Container */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000",
              fontFamily: "Inter_400Regular",
            }}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: item.unreadCount > 0 ? "#b5b88f" : "#888",
              fontWeight: item.unreadCount > 0 ? "600" : "400",
            }}
          >
            {item.time || "10:30 AM"}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#666",
              flex: 1,
              marginRight: 8,
            }}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View
              style={{
                backgroundColor: "#b5b88f",
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: 6,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: "bold",
                }}
              >
                {item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 0.8,
        borderBottomColor: "#eee",
        backgroundColor: item.read ? "#fff" : "#fbfbf2",
      }}
      onPress={() => handleNotificationPress(item)}
    >
      {/* Avatar */}
      <Image
        source={{ uri: item.avatar }}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          marginRight: 14,
        }}
      />

      {/* Info Container */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#000",
              fontFamily: "Inter_400Regular",
            }}
            numberOfLines={1}
          >
            {item.senderName}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#888",
            }}
          >
            {item.timestamp}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 13,
            color: "#b5b88f",
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          {item.groupName}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#666",
          }}
          numberOfLines={2}
        >
          {item.text}
        </Text>
      </View>
      {!item.read && (
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#b5b88f",
            marginLeft: 8,
          }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#000",
          paddingVertical: width * 0.09,
          paddingHorizontal: width * 0.05,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 0.5,
          borderBottomColor: "#fff",
        }}
      >
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons
            style={{ transform: [{ translateY: width * 0.06 }] }}
            name="menu"
            size={width * 0.11}
            color="#b5b88f"
          />
        </TouchableOpacity>

        <View
          style={{
            position: "absolute",
            left: "50%",
            transform: [{ translateX: -width * 0.13 }, { translateY: 20 }],
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "PlayfairDisplay_400Regular",
              fontSize: width * 0.08,
              fontWeight: "500",
            }}
          >
            StudyMate
          </Text>
        </View>
      </View>

      {/* Chat List Area */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          borderTopLeftRadius: width * 0.04,
          borderTopRightRadius: width * 0.04,
          paddingTop: 10,
        }}
      >
        {/* Segmented control tabs switcher */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginBottom: 8,
            backgroundColor: "#f5f5ef",
            borderRadius: 8,
            padding: 4,
            borderWidth: 1,
            borderColor: "#e6e6d8",
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: "center",
              backgroundColor: activeSegment === "notifications" ? "#b5b88f" : "transparent",
              borderRadius: 6,
            }}
            onPress={() => setActiveSegment("notifications")}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: activeSegment === "notifications" ? "#fff" : "#444",
                }}
              >
                Notifications
              </Text>
              {notifications.some((n) => !n.read) && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "red",
                  }}
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: "center",
              backgroundColor: activeSegment === "chats" ? "#b5b88f" : "transparent",
              borderRadius: 6,
            }}
            onPress={() => setActiveSegment("chats")}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: activeSegment === "chats" ? "#fff" : "#444",
              }}
            >
              Chats
            </Text>
          </TouchableOpacity>
        </View>

        {activeSegment === "chats" ? (
          <>
            {/* Search Bar */}
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#f5f5ef",
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  height: 40,
                  borderWidth: 1,
                  borderColor: "#e6e6d8",
                }}
              >
                <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                  placeholder="Search chats"
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={handleSearch}
                  style={{
                    flex: 1,
                    color: "#000",
                    fontSize: 15,
                    padding: 0,
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <Ionicons name="close-circle" size={18} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Chats List */}
            <FlatList
              data={filteredChats}
              keyExtractor={(item) => item.id}
              renderItem={renderChatItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View style={{ alignItems: "center", marginTop: 40 }}>
                  <Text style={{ color: "#888", fontSize: 15 }}>No chats found</Text>
                </View>
              }
            />
          </>
        ) : (
          <>
            {/* Notifications Action Header */}
            {notifications.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#eee",
                }}
              >
                <TouchableOpacity onPress={markAllAsRead}>
                  <Text style={{ color: "#b5b88f", fontSize: 13, fontWeight: "600" }}>
                    Mark all as read
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={clearAllNotifications}>
                  <Text style={{ color: "red", fontSize: 13, fontWeight: "600" }}>
                    Clear all
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Notifications List */}
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={renderNotificationItem}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <View style={{ alignItems: "center", marginTop: 40 }}>
                  <Text style={{ color: "#888", fontSize: 15 }}>No notifications yet</Text>
                </View>
              }
            />
          </>
        )}
      </View>
    </View>
  );
};

export default Notification;
