import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation, DrawerActions } from "@react-navigation/native";

const { height, width } = Dimensions.get("window"); // Get device width

const Homepage = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

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

      {/* Use ScrollView and add paddingBottom to avoid overlap */}
      <ScrollView
        style={{ backgroundColor: "#000" }}
        contentContainerStyle={{ paddingBottom: width * 0.20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#FFFFF1",
            marginHorizontal: width * 0.02,
            marginTop: 10,
            padding: 20,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            position: "relative",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
            onPress={() => navigation.navigate("profilepage")}
          >
            <Ionicons name="person-circle" size={width * 0.12} color="#000" />
          </TouchableOpacity>

          <View style={{ flex: 0, alignSelf: "flex-end" }}>
            <Text
              style={{
                color: "#000",
                fontSize: width * 0.18,
                fontWeight: "bold",
                fontFamily: "PlayfairDisplay_400Regular",
                transform: [
                  { translateY: width * 0.07 },
                  { translateX: -width * 0.02 },
                ],
              }}
            >
              HOME
            </Text>
          </View>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text
              style={{
                color: "#000",
                fontSize: width * 0.03,
                textAlign: "right",
                transform: [
                  { translateY: width * 0.03 },
                  { translateX: width * 0.02 },
                ],
              }}
            >
              Your desk is all set, let's get stuff done
            </Text>
          </View>
        </TouchableOpacity>

        {/* Cards Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: height * 0.24,
          }}
        >
          {/* Card 1 - Join a meeting */}
          <TouchableOpacity
            onPress={() => navigation.navigate("meetingscreen")}
            style={{
              backgroundColor: "#9CA37C",
              marginHorizontal: width * 0.02,
              marginTop: 10,
              marginBottom: 5,
              padding: 20,
              flex: 1,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
              justifyContent: "space-between",
            }}
          >
            <Ionicons name="videocam" size={width * 0.1} color="#000" />
            <Text
              style={{
                color: "#000",
                fontSize: width * 0.05,
                fontWeight: "bold",
                fontFamily: "Inter_400Regular",
                paddingBottom: 20,
              }}
            >
              Join a meeting
            </Text>
          </TouchableOpacity>

          {/* Card 2 - EduShorts */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Edushorts")}
            style={{
              backgroundColor: "#FFFFF1",
              marginHorizontal: width * 0.02,
              marginTop: 10,
              marginBottom: 5,
              padding: 20,
              flex: 1,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
              justifyContent: "space-between",
            }}
          >
            <MaterialIcons name="movie" size={width * 0.1} color="black" />
            <Text
              style={{
                color: "#000",
                fontSize: width * 0.05,
                fontWeight: "bold",
                fontFamily: "Inter_400Regular",
                paddingBottom: 20,
              }}
            >
              EduShorts
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            height: height * 0.24,
          }}
        >
          {/* Card 1 - Study Groups */}
          <TouchableOpacity
            style={{
              backgroundColor: "#FFFFF1",
              marginHorizontal: width * 0.02,
              marginTop: 10,
              marginBottom: 5,
              padding: 20,
              flex: 1,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
              justifyContent: "space-between",
            }}
            onPress={() => navigation.navigate("mygroups")}
          >
            <Ionicons name="people" size={width * 0.1} color="#000" />
            <Text
              style={{
                color: "#000",
                fontSize: width * 0.05,
                fontWeight: "bold",
                fontFamily: "Inter_400Regular",
                paddingBottom: 20,
              }}
            >
              Study Groups
            </Text>
          </TouchableOpacity>

          {/* Card 2 - Notes */}
          <TouchableOpacity
            style={{
              backgroundColor: "#FFFFF1",
              marginHorizontal: width * 0.02,
              marginTop: 10,
              marginBottom: 5,
              padding: 20,
              flex: 1,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
              justifyContent: "space-between",
            }}
            onPress={() => navigation.navigate("notes")}
          >
            <Ionicons name="document-text" size={width * 0.1} color="#000" />
            <Text
              style={{
                color: "#000",
                fontSize: width * 0.05,
                fontWeight: "bold",
                fontFamily: "Inter_400Regular",
                paddingBottom: 20,
              }}
            >
              Notes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Final Card - Study Material */}
        <TouchableOpacity
          style={{
            backgroundColor: "#FFFFF1",
            marginHorizontal: width * 0.02,
            marginTop: 10,
            padding: 20,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            height: height * 0.17,
            justifyContent: "space-between",
          }}
          onPress={() => navigation.navigate("studymaterial")}
        >
          <FontAwesome5 name="book" size={width * 0.1} color="black" />
          <View>
            <Text
              style={{
                color: "#000",
                fontSize: width * 0.05,
                fontWeight: "bold",
                fontFamily: "Inter_400Regular",
                paddingBottom: 1,
              }}
            >
              Study Material
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Homepage;
