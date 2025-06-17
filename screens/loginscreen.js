import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const BASE_URL = "https://studymate-cirr.onrender.com";

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    secureTextEntry: true,
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { width, height } = useWindowDimensions();

  const validateEmail = (text) => {
    setFormData((prev) => ({ ...prev, email: text }));
    if (text === "") {
      setErrors((prev) => ({ ...prev, email: "" }));
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({
        ...prev,
        email: emailRegex.test(text) ? "" : "Invalid email format",
      }));
    }
  };

  const validatePassword = (text) => {
    setFormData((prev) => ({ ...prev, password: text }));
    setErrors((prev) => ({
      ...prev,
      password:
        text.length >= 8 ? "" : "Password must be at least 8 characters long",
    }));
  };

  const validateAndLogin = async () => {
    if (
      !errors.email &&
      !errors.password &&
      formData.email &&
      formData.password
    ) {
      try {
        setLoading(true);
        console.log("Sending POST request to backend...");

        const response = await fetch(`${BASE_URL}/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        console.log("Response Status:", response.status);
        let responseData;
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        console.log("Backend Response Data:", responseData);

        if (response.ok) {
          const token = responseData.authToken;
          const user = responseData.details;

          if (!token || !user) {
            throw new Error("Token or user data not received from server.");
          }

          // Store the token and user details in AsyncStorage
          await AsyncStorage.setItem("token", token);
          await AsyncStorage.setItem("user", JSON.stringify(user));

          setLoading(false);
          navigation.navigate("OtpScreen", {
            email: formData.email,
            authToken: token,
          });
        } else {
          setLoading(false);
          const errorMessage =
            typeof responseData === "object"
              ? responseData.message || "Login failed"
              : responseData || "Login failed";
          Alert.alert("Error", errorMessage);
        }
      } catch (error) {
        setLoading(false);
        console.error("Network Error:", error);
        Alert.alert("Error", error.message || "An unexpected error occurred.");
      }
    } else {
      Alert.alert("Error", "Please fix the errors before logging in.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFF1" }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: width * 0.05,
              paddingTop: height * 0.03,
              paddingBottom: 40,
              alignItems: "center",
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* App Name */}
            <Text
              style={{
                fontSize: 32,
                fontWeight: "600",
                color: "#000",
                textAlign: "center",
                fontFamily: "PlayfairDisplay_400Regular",
                alignSelf: "center",
                paddingTop: height * 0.15,
                paddingBottom: height * 0.05,
              }}
            >
              StudyMate
            </Text>

            <View
              style={{
                width: "95%",
                maxWidth: 400,
                backgroundColor: "#FFF",
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
                Welcome Back!
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
                Let's get started
              </Text>

              {/* Email Field */}
              <Text
                style={{
                  marginLeft: 15,
                  color: "#000",
                  marginBottom: 5,
                  fontFamily: "Inconsolata_400Regular",
                }}
              >
                Email
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={validateEmail}
                placeholder="Enter your email"
                placeholderTextColor="#666"
                style={{
                  width: "100%",
                  padding: 15,
                  borderWidth: 1,
                  borderColor: "#000",
                  borderRadius: 40,
                  backgroundColor: "white",
                  fontSize: 16,
                  fontFamily: "Inconsolata_400Regular",
                }}
              />
              {errors.email ? (
                <Text style={{ color: "red", marginLeft: 15, marginTop: 5 }}>
                  {errors.email}
                </Text>
              ) : null}

              {/* Password Field */}
              <Text
                style={{
                  marginLeft: 15,
                  color: "#000",
                  marginBottom: 5,
                  marginTop: 10,
                  fontFamily: "Inconsolata_400Regular",
                }}
              >
                Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#000",
                  borderRadius: 40,
                  backgroundColor: "white",
                  paddingRight: 15,
                  width: "100%",
                }}
              >
                <TextInput
                  value={formData.password}
                  onChangeText={validatePassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  secureTextEntry={formData.secureTextEntry}
                  style={{
                    flex: 1,
                    padding: 15,
                    fontSize: 16,
                    fontFamily: "Inconsolata_400Regular",
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    setFormData((prev) => ({
                      ...prev,
                      secureTextEntry: !prev.secureTextEntry,
                    }))
                  }
                >
                  <Ionicons
                    name={formData.secureTextEntry ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={{ color: "red", marginLeft: 15, marginTop: 5 }}>
                  {errors.password}
                </Text>
              ) : null}

              <TouchableOpacity
                style={{ alignSelf: "flex-end", marginVertical: 10 }}
                onPress={() => navigation.navigate("forgotpass")}
              >
                <Text
                  style={{
                    color: "#566D67",
                    textDecorationLine: "underline",
                    fontFamily: "Inconsolata_400Regular",
                  }}
                >
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={validateAndLogin}
                style={{
                  backgroundColor: "#000",
                  padding: 15,
                  borderRadius: 40,
                  alignItems: "center",
                  width: "100%",
                  marginVertical: 10,
                  opacity: loading ? 0.6 : 1,
                }}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text
                    style={{
                      color: "white",
                      fontSize: 18,
                      fontFamily: "Inconsolata_400Regular",
                    }}
                  >
                    Login
                  </Text>
                )}
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <Text
                  style={{
                    color: "#555",
                    fontFamily: "Inconsolata_400Regular",
                  }}
                >
                  Don't have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("signup")}>
                  <Text
                    style={{
                      color: "#566D67",
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                      fontFamily: "Inconsolata_400Regular",
                    }}
                  >
                    Signup
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;