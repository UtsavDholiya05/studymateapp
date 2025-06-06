import React from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const NotificationsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar barStyle="light-content" />

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
        <TouchableOpacity onPress={() => console.log("Menu Clicked")}>
          <Ionicons
            style={{ transform: [{ translateY: 23 }] }}
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
            StudySmart
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
          <Text style={{ fontWeight: "normal" }}>9 new messages</Text>
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
        {[1, 2].map((item, index) => (
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
                uri: "https://randomuser.me/api/portraits/women/44.jpg",
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
                Sender
              </Text>
              <Text style={{ fontSize: width * 0.035, color: "#555" }}>
                4m ago
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
              }}
            >
              <Text style={{ fontSize: width * 0.035, color: "#333" }}>
                go to message
              </Text>
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
        {[1, 2, 3, 4].map((item, index) => (
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
                uri: "https://randomuser.me/api/portraits/women/44.jpg",
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
                {index % 2 === 0 ? "Sender" : "xyz invited you to join group"}
              </Text>
              <Text style={{ fontSize: width * 0.035, color: "#555" }}>
                4m ago
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
              }}
            >
              <Text style={{ fontSize: width * 0.035, color: "#333" }}>
                go to message
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
