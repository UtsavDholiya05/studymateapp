import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from "axios";

const BASE_URL = "https://studymate-cirr.onrender.com";

const otpscreen = ({ navigation, route }) => {
  const { email, authToken } = route.params;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const { width, height } = useWindowDimensions();

  // Send OTP on mount
  useEffect(() => {
    if (email && authToken) {
      sendOtp();
    } else {
      Alert.alert("Error", "Missing information. Please go back and try again.");
      navigation.goBack();
    }
  }, []);

  const sendOtp = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/user/auth/sendOtp?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("OTP sent:", response.data);
      // If backend responds with already verified, navigate
      if (
        response.data?.message &&
        response.data.message.toLowerCase().includes("already verified")
      ) {
        // Alert.alert(
        //   "Already Verified",
        //   "You are already verified. Redirecting to homepage..."
        // );
        navigation.navigate("homepage");
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      if (msg && msg.toLowerCase().includes("already verified")) {
        // Alert.alert(
        //   "Already Verified",
        //   "You are already verified. Redirecting to homepage..."
        // );
        navigation.navigate("homepage");
      } else {
        console.error(
          "Error sending OTP:",
          error.response?.data || error.message
        );
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    }
  };

  const verifyOtp = () => {
    navigation.replace("MainApp");
  };

  const handleChange = (text, index) => {
    if (text.length > 1) text = text[text.length - 1];
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FFFFF1",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: width * 0.05,
      }}
    >
      {/* Header */}
      <View
        style={{ position: "absolute", top: height * 0.08, left: width * 0.05 }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          <Text
            style={{
              fontSize: 16,
              color: "black",
              fontFamily: "Inconsolata_400Regular",
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>

      {/* OTP Box */}
      <View
        style={{
          width: "90%",
          maxWidth: 400,
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.4,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 5,
            fontFamily: "PlayfairDisplay_400Regular",
          }}
        >
          Enter OTP
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#666",
            textAlign: "center",
            marginBottom: 20,
            fontFamily: "Inconsolata_400Regular",
          }}
        >
          We sent a 6-digit verification code to your phone number
        </Text>

        {/* OTP Inputs */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={{
                width: width * 0.12,
                height: height * 0.06,
                borderWidth: 1,
                borderColor: "#000000",
                borderRadius: 30,
                textAlign: "center",
                fontSize: 24,
                backgroundColor: "#FFF",
                marginHorizontal: 5,
                fontFamily: "Inconsolata_400Regular",
                color: "#000",
              }}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === "Backspace") {
                  handleBackspace(digit, index);
                }
              }}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={verifyOtp}
          style={{
            backgroundColor: "#000000",
            padding: 15,
            borderRadius: 40,
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontFamily: "Inconsolata_400Regular",
            }}
          >
            Verify
          </Text>
        </TouchableOpacity>

        {/* Resend OTP */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 15,
          }}
        >
          <Text style={{ color: "#555", fontFamily: "Inconsolata_400Regular" }}>
            Didn’t receive code?{" "}
          </Text>
          <TouchableOpacity onPress={sendOtp}>
            <Text
              style={{
                color: "#566D67",
                fontWeight: "bold",
                textDecorationLine: "underline",
                fontFamily: "Inconsolata_400Regular",
              }}
            >
              Resend
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default otpscreen;