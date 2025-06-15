import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

// Initial notification data
const initialNewNotifications = [
  {
    sender: "Sender",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "4m ago",
  },
  {
    sender: "Sender",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "4m ago",
  },
];

const initialTodayNotifications = [
  {
    sender: "Sender",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "4m ago",
  },
  {
    sender: "xyz invited you to join group",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "4m ago",
  },
  {
    sender: "Sender",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "4m ago",
  },
  {
    sender: "xyz invited you to join group",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    time: "4m ago",
  },
];

const notification = () => {
  const navigation = useNavigation();
  const [newNotifications, setNewNotifications] = useState(initialNewNotifications);
  const [todayNotifications, setTodayNotifications] = useState(initialTodayNotifications);

  const totalNotifications = newNotifications.length + todayNotifications.length;

  const deleteNotification = (type, index) => {
    if (type === "new") {
      const updated = [...newNotifications];
      updated.splice(index, 1);
      setNewNotifications(updated);
    } else {
      const updated = [...todayNotifications];
      updated.splice(index, 1);
      setTodayNotifications(updated);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

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
            color="#9CA37C"
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

      {/* Banner */}
      <View
        style={{
          height: height * 0.15,
          backgroundColor: "#b5b88f",
          width: "100%",
          borderColor: "black",
          borderWidth: width * 0.008,
          borderRadius: width * 0.02,
        }}
      />

      {/* Notifications Section */}
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: width * 0.05,
          height: height * 0.85,
          backgroundColor: "#fff",
          borderRadius: width * 0.02,
          padding: width * 0.05,
          borderWidth: width * 0.008,
          borderRadius: width * 0.02,
        }}
      >
        <Text
          style={{
            fontSize: width * 0.05,
            fontWeight: "bold",
            marginVertical: height * 0.02,
          }}
        >
          Notifications{" "}
          <Text style={{ fontWeight: "normal" }}>
            {totalNotifications} new message{totalNotifications !== 1 ? "s" : ""}
          </Text>
        </Text>

        {/* New Messages */}
        <Text
          style={{
            fontSize: width * 0.045,
            fontWeight: "bold",
            marginBottom: height * 0.01,
          }}
        >
          New
        </Text>
        {newNotifications.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#d1d1c0",
              padding: width * 0.04,
              borderRadius: width * 0.02,
              marginBottom: height * 0.01,
            }}
          >
            <Image
              source={{
                uri: item.avatar,
              }}
              style={{
                width: width * 0.12,
                height: width * 0.12,
                borderRadius: width * 0.06,
                marginRight: width * 0.03,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: width * 0.04, fontWeight: "500" }}>
                {item.sender}
              </Text>
              <Text style={{ fontSize: width * 0.035, color: "#555" }}>
                {item.time}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                paddingVertical: height * 0.005,
                paddingHorizontal: width * 0.03,
                borderRadius: width * 0.02,
                borderWidth: 1,
                borderColor: "#aaa",
                marginRight: width * 0.02,
              }}
              onPress={() => navigation.navigate("chatscreen", { user: item.sender, avatar: item.avatar })}
            >
              <Text style={{ fontSize: width * 0.035, color: "#333" }}>
                go to message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteNotification("new", index)}
              style={{
                padding: width * 0.015,
              }}
            >
              <Feather name="trash-2" size={width * 0.06} color="#a00" />
            </TouchableOpacity>
          </View>
        ))}

        {/* Today Messages */}
        <Text
          style={{
            fontSize: width * 0.045,
            fontWeight: "bold",
            marginVertical: height * 0.01,
          }}
        >
          Today
        </Text>
        {todayNotifications.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#d1d1c0",
              padding: width * 0.04,
              borderRadius: width * 0.02,
              marginBottom: height * 0.01,
            }}
          >
            <Image
              source={{
                uri: item.avatar,
              }}
              style={{
                width: width * 0.12,
                height: width * 0.12,
                borderRadius: width * 0.06,
                marginRight: width * 0.03,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: width * 0.04, fontWeight: "500" }}>
                {item.sender}
              </Text>
              <Text style={{ fontSize: width * 0.035, color: "#555" }}>
                {item.time}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#fff",
                paddingVertical: height * 0.005,
                paddingHorizontal: width * 0.03,
                borderRadius: width * 0.02,
                borderWidth: 1,
                borderColor: "#aaa",
                marginRight: width * 0.02,
              }}
              onPress={() => navigation.navigate("ChatScreen", { user: item.sender, avatar: item.avatar })}
            >
              <Text style={{ fontSize: width * 0.035, color: "#333" }}>
                go to message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => deleteNotification("today", index)}
              style={{
                padding: width * 0.015,
              }}
            >
              <Feather name="trash-2" size={width * 0.06} color="#a00" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default notification;
