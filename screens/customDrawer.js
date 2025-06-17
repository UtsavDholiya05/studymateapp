import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const CustomDrawer = ({ navigation }) => {
  const [search, setSearch] = React.useState("");

  return (
    <View style={styles.drawer}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.closeDrawer()}
      >
        <Ionicons name="arrow-back" size={28} color="#f5f5dc" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Ionicons name="person-circle" size={60} color="#f5f5dc" />
        <Text style={styles.username}>Welcome!</Text>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholder="Search"
        placeholderTextColor="#f5f5dc"
      />

      {/* Menu Container */}
      <View style={styles.menuContainer}>
        {/* Navigate to Home */}
        <TouchableOpacity
          style={styles.activeItem}
          onPress={() => navigation.navigate("MainStack", { screen: "Homepage" })}
        >
          <Ionicons name="home" size={22} color="#111" style={{ marginRight: 8 }} />
          <Text style={styles.activeText}>Home</Text>
        </TouchableOpacity>

        {/* Navigate to Edit Profile Page */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons name="settings" size={22} color="#f5f5dc" style={{ marginRight: 8 }} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        {/* To-Do Section */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("ToDoList")}
        >
          <Ionicons name="checkmark-circle" size={22} color="#f5f5dc" style={{ marginRight: 8 }} />
          <Text style={styles.menuText}>To-Do</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 60,
    paddingHorizontal: 30,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    paddingVertical: 40,
    paddingHorizontal: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  username: {
    color: "#f5f5dc",
    fontSize: 20,
    fontFamily: "serif",
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "bold",
  },
  searchInput: {
    color: "#f5f5dc",
    fontSize: 18,
    marginBottom: 35,
    fontFamily: "serif",
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginHorizontal: 10, // Added marginHorizontal
    backgroundColor: "#222",
    borderRadius: 8,
  },
  menuContainer: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 18,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  menuText: {
    color: "#f5f5dc",
    fontSize: 20,
    fontFamily: "serif",
  },
  activeItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5dc",
    borderRadius: 15,
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
  },
  activeText: {
    color: "#111",
    fontSize: 20,
    fontFamily: "serif",
    fontWeight: "bold",
  },
});

export default CustomDrawer;