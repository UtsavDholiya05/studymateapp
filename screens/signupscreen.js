import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Keyboard,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const BASE_URL = "https://studymate-cirr.onrender.com"; // Backend URL

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    contact: "",
  });
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { width, height } = useWindowDimensions();

  const validateName = (text) => {
    setFormData((prev) => ({ ...prev, username: text }));
    setErrors((prev) => ({
      ...prev,
      username:
        text.length >= 4 ? "" : "Username must be at least 4 characters",
    }));
  };

  const validateEmail = (text) => {
    setFormData((prev) => ({ ...prev, email: text }));
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setErrors((prev) => ({
      ...prev,
      email: emailRegex.test(text) ? "" : "Invalid email format",
    }));
  };

  const validatePassword = (text) => {
    setFormData((prev) => ({ ...prev, password: text }));
    setErrors((prev) => ({
      ...prev,
      password:
        text.length >= 8 ? "" : "Password must be at least 8 characters",
    }));
  };

  const validateContact = (text) => {
    setFormData((prev) => ({ ...prev, contact: text }));
    const contactRegex = /^\d{10}$/;
    setErrors((prev) => ({
      ...prev,
      contact: contactRegex.test(text)
        ? ""
        : "Contact must be a 10-digit number",
    }));
  };

  const handleSignup = async () => {
    const { username, email, password, contact } = formData;

    if (
      username &&
      email &&
      password &&
      contact &&
      !errors.username &&
      !errors.email &&
      !errors.password &&
      !errors.contact
    ) {
      try {
        console.log("Sending Signup Request with Payload:", formData);
        const response = await fetch(`${BASE_URL}/user/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        console.log("Response Status:", response.status);

        const contentType = response.headers.get("content-type");
        let responseData;

        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          const textData = await response.text();
          responseData = { message: textData };
        }

        console.log("Backend Response Data:", responseData);

        if (response.ok) {
          navigation.navigate("otpscreen", { email: formData.email });
        } else {
          alert(responseData.message || "Signup failed");
        }
      } catch (error) {
        console.error("Network Error Details:", error);
        alert("Network error. Please try again.");
      }
    } else {
      alert("Please fill all fields correctly");
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
            <Text
              style={{
                fontSize: 32,
                fontWeight: "600",
                color: "#000",
                textAlign: "center",
                marginBottom: height * 0.06,
                alignSelf: "center",
                paddingTop: height * 0.10,
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
                  fontSize: 28,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Create Your Account
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#666",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Let's get started
              </Text>

              {/* Username */}
              <Text style={{ marginLeft: 15 }}>Username</Text>
              <TextInput
                value={formData.username}
                onChangeText={validateName}
                placeholder="Enter your username"
                style={inputStyle}
              />
              {errors.username ? (
                <Text style={errorStyle}>{errors.username}</Text>
              ) : null}

              {/* Email */}
              <Text style={{ marginLeft: 15, marginTop: 10 }}>Email</Text>
              <TextInput
                value={formData.email}
                onChangeText={validateEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                style={inputStyle}
              />
              {errors.email ? (
                <Text style={errorStyle}>{errors.email}</Text>
              ) : null}

              {/* Password */}
              <Text style={{ marginLeft: 15, marginTop: 10 }}>Password</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  position: "relative",
                }}
              >
                <TextInput
                  value={formData.password}
                  onChangeText={validatePassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#666"
                  secureTextEntry={!isPasswordVisible}
                  style={{
                    width: "100%",
                    padding: 15,
                    borderWidth: 1,
                    borderColor: "#000",
                    borderRadius: 40,
                    backgroundColor: "white",
                    fontSize: 16,
                  }}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible((prev) => !prev)}
                  style={{ position: "absolute", right: 15, padding: 10 }}
                >
                  <Icon
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#000"
                  />
                </TouchableOpacity>
              </View>
              {errors.password ? (
                <Text style={{ color: "red", marginLeft: 15, marginTop: 5 }}>
                  {errors.password}
                </Text>
              ) : null}

              {/* Contact */}
              <Text style={{ marginLeft: 15, marginTop: 10 }}>Contact No.</Text>
              <TextInput
                value={formData.contact}
                onChangeText={validateContact}
                placeholder="Enter your contact number"
                keyboardType="phone-pad"
                maxLength={10}
                style={inputStyle}
              />
              {errors.contact ? (
                <Text style={errorStyle}>{errors.contact}</Text>
              ) : null}

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={handleSignup}
                style={{
                  backgroundColor: "#000",
                  padding: 15,
                  borderRadius: 40,
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text style={{ color: "#FFF", fontSize: 16 }}>Sign Up</Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginTop: 15,
                }}
              >
                <Text style={{ color: "#555" }}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("login")}>
                  <Text
                    style={{
                      color: "#566D67",
                      fontWeight: "bold",
                      textDecorationLine: "underline",
                    }}
                  >
                    Login
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

const inputStyle = {
  width: "100%",
  padding: 15,
  borderWidth: 1,
  borderColor: "#000",
  borderRadius: 40,
  backgroundColor: "#FFF",
  fontSize: 16,
  marginTop: 5,
};

const errorStyle = {
  color: "red",
  marginLeft: 15,
  marginTop: 5,
  fontSize: 13,
};

export default SignupScreen;