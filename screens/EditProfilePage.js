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
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const EditProfilePage = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableData, setEditableData] = useState({
    username: "",
    contact: "",
    email: "",
  });

  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) throw new Error("User not found");
      const user = JSON.parse(storedUser);
      setUserData(user);
      setEditableData({
        username: user.username || "",
        contact: user.contact || "",
        email: user.email || "",
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      // Get JWT token from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "User token not found. Please log in again.");
        navigation.navigate("loginpage"); // Navigate to login if no token found
        return;
      }

      const updatedUserData = {
        username: editableData.username.trim(),
        contact: editableData.contact.trim(),
        email: editableData.email.trim().toLowerCase(),
      };

      const response = await axios.patch(
        "https://studymate-cirr.onrender.com/user/update",
        updatedUserData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach JWT here
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const updatedUser = { ...userData, ...updatedUserData };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        const confirmedUser = await AsyncStorage.getItem("user");
        console.log("Updated user saved in AsyncStorage:", JSON.parse(confirmedUser));
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const renderEditableRow = (label, valueKey, placeholder) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: height * 0.015,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
      }}
    >
      <Text style={{ color: "#666", fontSize: width * 0.04 }}>{label}</Text>
      <TextInput
        style={{
          fontSize: width * 0.04,
          textAlign: "right",
          flex: 1,
          marginLeft: width * 0.1,
          paddingVertical: 2,
          color: "black",
        }}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={editableData[valueKey]}
        onChangeText={(text) =>
          setEditableData({ ...editableData, [valueKey]: text })
        }
      />
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

      <ScrollView showsVerticalScrollIndicator={false}>
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
                  uri:
                    userData?.profileImage ||
                    "https://randomuser.me/api/portraits/women/44.jpg",
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

            {/* Editable Fields */}
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
              Edit info
            </Text>

            {renderEditableRow("Name", "username", "Enter your name")}
            {renderEditableRow("Contact No", "contact", "Enter your contact")}
            {renderEditableRow("Email", "email", "Enter your email")}

            <TouchableOpacity
              style={{
                marginTop: height * 0.05,
                backgroundColor: "#9CA37C",
                paddingVertical: height * 0.02,
                borderRadius: width * 0.02,
                alignItems: "center",
              }}
              onPress={handleSaveChanges}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: width * 0.05,
                  fontWeight: "600",
                }}
              >
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfilePage;
