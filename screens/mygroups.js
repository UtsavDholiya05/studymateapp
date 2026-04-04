import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
const { height, width } = Dimensions.get("window");

const MyGroups = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinGroupId, setJoinGroupId] = useState("");

  // Load groups from AsyncStorage on mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const stored = await AsyncStorage.getItem("mygroups");
        if (stored) setGroups(JSON.parse(stored));
        else
          setGroups([
            { id: 1, name: "AI Study Group", owner: "Sarah" },
            { id: 2, name: "Web Dev Team", owner: "Sarah" },
          ]);
      } catch (e) {
        setGroups([]);
      }
    };
    loadGroups();
  }, []);

  // Save groups to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem("mygroups", JSON.stringify(groups));
  }, [groups]);

  const createGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert("Validation Error", "Group name cannot be empty.");
      return;
    }

    try {
      // await axios.post("https://your-backend.com/group/create", { name: newGroupName, description });
      const newId = Date.now().toString();
      const newGroup = {
        id: newId,
        name: newGroupName,
        owner: "You",
        description: description.trim(),
      };
      setGroups([...groups, newGroup]);
      setShowModal(false);
      setNewGroupName("");
      setDescription("");
      Alert.alert("Success", `Group created (ID: ${newId})`);
    } catch (error) {
      Alert.alert("Error", "Failed to create group");
    }
  };

  const deleteGroup = (id) => {
    Alert.alert("Confirm", "Are you sure you want to delete this group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // await axios.delete(`https://your-backend.com/group/delete/${id}`);
            setGroups(groups.filter((group) => group.id !== id));
          } catch (error) {
            Alert.alert("Error", "Failed to delete group");
          }
        },
      },
    ]);
  };

  const joinGroupById = async () => {
    if (!joinGroupId.trim()) {
      Alert.alert("Validation Error", "Please enter a group ID.");
      return;
    }
    // Find group by ID
    const stored = await AsyncStorage.getItem("mygroups");
    let allGroups = stored ? JSON.parse(stored) : [];
    const group = allGroups.find((g) => String(g.id) === joinGroupId.trim());
    if (!group) {
      Alert.alert("Not Found", "No group found with this ID.");
      return;
    }
    // Check if already joined
    if (groups.some((g) => String(g.id) === joinGroupId.trim())) {
      Alert.alert("Already Joined", "You are already in this group.");
      return;
    }
    setGroups([...groups, group]);
    setShowJoinModal(false);
    setJoinGroupId("");
    Alert.alert("Success", `Joined group: ${group.name}`);
  };

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
          height: height * 0.15,
          backgroundColor: "#b5b88f",
          width: "100%",
          borderColor: "black",
          borderWidth: width * 0.008,
          borderRadius: width * 0.02,
        }}
      />

      {/* Profile Section */}
      <View
        style={{
          height: height * 0.85,
          backgroundColor: "#fff",
          borderRadius: width * 0.02,
          padding: width * 0.05,
          paddingTop: height * 0.12,
          borderWidth: width * 0.008,
        }}
      >
        {/* Profile Picture */}
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
              uri: "https://randomuser.me/api/portraits/women/44.jpg",
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
          >
            <Feather name="plus" size={width * 0.07} color="black" />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: width * 0.06,
            fontWeight: "bold",
            marginTop: height * 0.03,
            top: -height * 0.089,
          }}
        >
          Sarah Smiths
        </Text>

        {/* My Groups Section */}
        <View
          style={{ marginTop: height * 0.02, top: -height * 0.065, flex: 1 }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: width * 0.05, fontWeight: "500" }}>
              My Groups
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity onPress={() => setShowModal(true)}>
                <Text style={{ fontSize: width * 0.045, color: "#007bff" }}>
                  + new group
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowJoinModal(true)}>
                <Text style={{ fontSize: width * 0.045, color: "#007bff" }}>
                  Join with Group ID
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={{ marginTop: height * 0.02 }}>
            {groups.map((group) => (
              <View
                key={group.id}
                style={{
                  backgroundColor: "#d1d1c0",
                  padding: width * 0.04,
                  borderRadius: width * 0.02,
                  marginVertical: height * 0.008,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{ fontSize: width * 0.045, fontWeight: "500" }}
                    >
                      {group.name}
                    </Text>
                    <Text style={{ fontSize: width * 0.035, color: "#555" }}>
                      {group.owner}
                    </Text>
                    <Text style={{ fontSize: width * 0.032, color: "#777" }}>
                      ID: {group.id}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("groupchat", {
                          groupId: group.id,
                          groupName: group.name,
                          groupOwner: group.owner,
                        })
                      }
                      style={{
                        backgroundColor: "#fff",
                        paddingVertical: height * 0.005,
                        paddingHorizontal: width * 0.03,
                        borderRadius: width * 0.02,
                        marginRight: width * 0.03,
                        borderWidth: 1,
                        borderColor: "#aaa",
                      }}
                    >
                      <Text style={{ fontSize: width * 0.035, color: "#333" }}>
                        Open Group
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteGroup(group.id)}>
                      <Feather name="trash-2" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Group Creation Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Group</Text>
            <TextInput
              placeholder="Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={[styles.modalButton, { backgroundColor: "gray" }]}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={createGroup}
                style={styles.modalButton}
              >
                <Text style={{ color: "#fff" }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Join Group Modal */}
      <Modal visible={showJoinModal} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Join Group by ID</Text>
            <TextInput
              placeholder="Enter Group ID"
              value={joinGroupId}
              onChangeText={setJoinGroupId}
              style={styles.input}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => setShowJoinModal(false)}
                style={[styles.modalButton, { backgroundColor: "gray" }]}
              >
                <Text style={{ color: "#fff" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={joinGroupById}
                style={styles.modalButton}
              >
                <Text style={{ color: "#fff" }}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default MyGroups;
