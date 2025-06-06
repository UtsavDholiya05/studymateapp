import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ForgotPass = ({ navigation }) => {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState(""); // <-- Add this

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
      <View style={{ position: "absolute", top: height * 0.08, left: width * 0.05 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          <Text style={{ fontSize: 16, color: "black", fontFamily: "Inconsolata_400Regular" }}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Forgot Password Box */}
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
        <Text style={{ fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 5, fontFamily: "PlayfairDisplay_400Regular" }}>
          Forgot Password?
        </Text>
        <Text style={{ fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20, fontFamily: "Inconsolata_400Regular" }}>
          we got you!
        </Text>

        {/* Email Input Field */}
        <View style={{ width: "100%", marginBottom: 10 }}>
          <Text style={{ marginLeft: 15, color: "#000000", fontFamily: "Inconsolata_400Regular", marginBottom: 5 }}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#666"
            value={email} // <-- Add this
            onChangeText={setEmail} // <-- Add this
            style={{
              width: "100%",
              padding: 15,
              borderWidth: 1,
              borderColor: "#000000",
              borderRadius: 40,
              backgroundColor: "white",
              fontSize: 16,
              fontFamily: "Inconsolata_400Regular",
              color: "#000",
              marginBottom:5,
            }}
          />
        </View>

        {/* Send Code Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#000000",
            padding: 15,
            borderRadius: 40,
            alignItems: "center",
            width: "100%",
          }}
          onPress={() => navigation.navigate("otpscreen", { email })} // <-- Pass email param
        >
          <Text style={{ color: "white", fontSize: 18, fontFamily: "Inconsolata_400Regular" }}>Send Code</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPass;