import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const ProfilePage = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) throw new Error("User not found");
      const user = JSON.parse(storedUser);
      setUserData(user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data every time the screen comes into focus
  useEffect(() => {
    if (isFocused) {
      setLoading(true); // show spinner while loading
      fetchUserData();
    }
  }, [isFocused]);

  const renderInfoRow = (label, value) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: height * 0.015,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      <Text style={{ color: "#666", fontSize: width * 0.04 }}>{label}</Text>
      <Text style={{ fontSize: width * 0.04 }}>
        {label === "Change password" ? "••••••••" : value}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="#9CA37C" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back-ios"
            size={width * 0.09}
            color="#9CA37C"
            style={{ alignSelf: "center", transform: [{ translateY: width * 0.06 }] }}
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
          height: height * 0.20,
          backgroundColor: "#b5b88f",
          width: "100%",
          borderColor: "black",
          borderWidth: width * 0.008,
          borderRadius: width * 0.02,
        }}
      />

      {/* Profile Card */}
      <View>
        <View
          style={{
            height: height * 0.85,
            backgroundColor: "#fff",
            borderRadius: width * 0.02,
            padding: width * 0.05,
            paddingTop: height * 0.12,
            borderWidth: width * 0.008,
            marginTop: -height * 0.05,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 5,
          }}
        >
          {/* Profile Image */}
          <View
            style={{
              position: "absolute",
              top: -height * 0.045,
              left: width * 0.09,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={{
                uri: userData?.profileImage || "https://randomuser.me/api/portraits/women/44.jpg",
              }}
              style={{
                width: width * 0.21,
                height: width * 0.21,
                borderRadius: width * 0.21,
              }}
            />
            <TouchableOpacity
              style={{
                marginLeft: -width * 0.06,
                backgroundColor: "white",
                width: width * 0.08,
                height: width * 0.08,
                borderRadius: width * 0.04,
                alignItems: "center",
                justifyContent: "center",
                transform: [{ translateY: width * 0.05 }],
              }}
              onPress={() => console.log("Change profile picture clicked")}
            >
              <Feather name="plus" size={width * 0.07} color="black" />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <Text
            style={{
              fontSize: width * 0.06,
              fontWeight: "bold",
              marginTop: -height * 0.055,
              marginBottom: height * 0.02,
            }}
          >
            {userData?.username || "User"}
          </Text>
          <Text
            style={{
              fontSize: width * 0.05,
              fontWeight: "500",
              marginBottom: height * 0.02,
            }}
          >
            Basic info
          </Text>

          {renderInfoRow("Name", userData?.username || "N/A")}
          {renderInfoRow("Contact No", userData?.contact || "N/A")}
          {/* {renderInfoRow("Gender", userData?.gender || "N/A")} */}
          {renderInfoRow("Email", userData?.email || "N/A")}
          {renderInfoRow("Change password", "")}

          <TouchableOpacity
            style={{
              marginTop: height * 0.05,
              backgroundColor: "#9CA37C",
              paddingVertical: height * 0.02,
              borderRadius: width * 0.02,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("editprofilepage")}
          >
            <Text
              style={{
                color: "white",
                fontSize: width * 0.05,
                fontWeight: "600",
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePage;
