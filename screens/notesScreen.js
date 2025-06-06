import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const notesScreen = () => {
  const navigation = useNavigation();
  const [folders, setFolders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [renameFolderId, setRenameFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadFolders = async () => {
      const storedFolders = await AsyncStorage.getItem("folders");
      if (storedFolders) setFolders(JSON.parse(storedFolders));
      else setFolders([
        { id: 1, name: "Maths", files: [], notes: [] },
        { id: 2, name: "Chemistry", files: [], notes: [] },
      ]);
    };
    loadFolders();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  const addFolder = () => {
    if (folderName.trim()) {
      const newFolder = { id: Date.now(), name: folderName.trim(), files: [], notes: [] };
      setFolders([...folders, newFolder]);
      setFolderName("");
      setModalVisible(false);
    } else Alert.alert("Error", "Folder name cannot be empty.");
  };

  const renameFolder = () => {
    if (folderName.trim()) {
      setFolders(
        folders.map((folder) =>
          folder.id === renameFolderId
            ? { ...folder, name: folderName.trim() }
            : folder
        )
      );
      setFolderName("");
      setRenameFolderId(null);
      setModalVisible(false);
    } else Alert.alert("Error", "Folder name cannot be empty.");
  };

  const deleteFolder = (id) => {
    Alert.alert("Delete Folder", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setFolders(folders.filter((folder) => folder.id !== id));
        },
      },
    ]);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const FOLDER_SIZE = (width - 2 * 20 - 2 * (width * 0.02) - 16) / 2;

  const renderFolder = ({ item }) => (
    <View
      style={{
        backgroundColor: "#FFD700",
        width: FOLDER_SIZE,
        height: FOLDER_SIZE,
        borderRadius: 15,
        margin: 5,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        position: "relative",
      }}
    >
      <TouchableOpacity
        style={{ position: "absolute", top: 8, left: 8 }}
        onPress={() => {
          setModalVisible(true);
          setRenameFolderId(item.id);
          setFolderName(item.name);
        }}
      >
        <MaterialIcons name="edit" size={22} color="blue" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", top: 8, right: 8 }}
        onPress={() => deleteFolder(item.id)}
      >
        <MaterialIcons name="delete" size={22} color="red" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("FolderDetail", {
            folder: item,
            updateFolder: (updatedFolder) => {
              setFolders(folders.map(f => f.id === updatedFolder.id ? updatedFolder : f));
            }
          });
        }}
      >
        <MaterialIcons name="folder" size={FOLDER_SIZE * 0.3} color="#000" />
        <Text
          style={{
            fontSize: FOLDER_SIZE * 0.12,
            color: "#000",
            textAlign: "center",
            marginTop: 5,
          }}
          numberOfLines={2}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
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

      {/* Search & Title */}
      <View
        style={{
          backgroundColor: "#FFFFF1",
          marginHorizontal: width * 0.02,
          marginTop: 10,
          padding: 20,
          borderRadius: 10,
        }}
      >
        <TextInput
          placeholder="Find Group"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{
            backgroundColor: "#fff",
            borderRadius: 10,
            padding: 10,
            fontSize: width * 0.04,
            borderWidth: 1,
            borderColor: "#ccc",
            marginBottom: 15,
          }}
        />
        <Text
          style={{
            color: "#000",
            fontSize: width * 0.08,
            fontWeight: "bold",
            fontFamily: "PlayfairDisplay_400Regular",
            marginBottom: 5,
          }}
        >
          Study Materials
        </Text>
        <Text
          style={{
            color: "#000",
            fontSize: width * 0.04,
            fontFamily: "Inter_400Regular",
          }}
        >
          everything you need
        </Text>
      </View>

      {/* Folder Grid */}
      <View
        style={{
          backgroundColor: "#FFFFF1",
          margin: width * 0.02,
          padding: 20,
          borderRadius: 10,
          flex: 1,
        }}
      >
        <Text
          style={{
            color: "#000",
            fontSize: width * 0.05,
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Subjects
        </Text>

        {/* Add Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#E0E0E0",
            padding: 12,
            borderRadius: 10,
            marginBottom: 10,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
          onPress={() => {
            setModalVisible(true);
            setRenameFolderId(null);
          }}
        >
          <MaterialIcons name="add" size={24} color="#000" />
          <Text style={{ fontSize: 16, color: "#000", marginLeft: 6 }}>
            Add New Folder
          </Text>
        </TouchableOpacity>

        {/* Folder Grid */}
        <FlatList
          data={filteredFolders}
          renderItem={renderFolder}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{
            paddingBottom: 30,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
        />
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 15,
              width: "80%",
            }}
          >
            <TextInput
              placeholder="Enter folder name"
              value={folderName}
              onChangeText={setFolderName}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                padding: 10,
                marginBottom: 20,
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#9CA37C",
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
              }}
              onPress={renameFolderId ? renameFolder : addFolder}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {renameFolderId ? "Rename Folder" : "Add Folder"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10, alignItems: "center" }}
              onPress={() => {
                setModalVisible(false);
                setFolderName("");
                setRenameFolderId(null);
              }}
            >
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default notesScreen;