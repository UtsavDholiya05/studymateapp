import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  Dimensions,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants"; // <-- Add this import

const { width } = Dimensions.get("window");

const StudyMaterialPage = () => {
  const [folders, setFolders] = useState([]);
  const [folderInput, setFolderInput] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [folderModal, setFolderModal] = useState(false);

  // Load folders and notes from storage
  useEffect(() => {
    const loadData = async () => {
      const storedFolders = await AsyncStorage.getItem("folders");
      if (storedFolders) setFolders(JSON.parse(storedFolders));
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  // When folder changes, load its notes
  useEffect(() => {
    if (selectedFolder) {
      setNotes(selectedFolder.notes || []);
    }
  }, [selectedFolder]);

  // Save notes to the selected folder
  useEffect(() => {
    if (selectedFolder) {
      setFolders((prev) =>
        prev.map((f) =>
          f.id === selectedFolder.id ? { ...f, notes } : f
        )
      );
    }
  }, [notes]);

  // Folder CRUD
  const addFolder = () => {
    if (folderInput.trim()) {
      setFolders([{ name: folderInput.trim(), id: Date.now(), notes: [] }, ...folders]);
      setFolderInput("");
      setFolderModal(false);
    }
  };

  const deleteFolder = (id) => {
    Alert.alert("Delete Folder", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setFolders(folders.filter((f) => f.id !== id));
          if (selectedFolder && selectedFolder.id === id) setSelectedFolder(null);
        },
      },
    ]);
  };

  // Notes CRUD
  const addNote = () => {
    if (noteInput.trim()) {
      setNotes([{ text: noteInput.trim(), id: Date.now() }, ...notes]);
      setNoteInput("");
      Keyboard.dismiss();
    }
  };

  const startEdit = (idx) => {
    setEditIdx(idx);
    setNoteInput(notes[idx].text);
    setModalVisible(true);
  };

  const saveEdit = () => {
    if (noteInput.trim()) {
      const updated = [...notes];
      updated[editIdx].text = noteInput.trim();
      setNotes(updated);
      setEditIdx(null);
      setNoteInput("");
      setModalVisible(false);
      Keyboard.dismiss();
    }
  };

  const deleteNote = (idx) => {
    Alert.alert("Delete Note", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setNotes(notes.filter((_, i) => i !== idx)),
      },
    ]);
  };

  // Folder List UI
  const renderFolder = ({ item }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
        justifyContent: "space-between",
      }}
      onPress={() => setSelectedFolder(item)}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <MaterialIcons name="folder" size={28} color="#9CA37C" style={{ marginRight: 10 }} />
        <Text style={{ fontSize: 18, flex: 1 }}>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteFolder(item.id)}>
        <MaterialIcons name="delete" size={22} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Notes List UI
  const renderItem = ({ item, index }) => (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 16,
        marginVertical: 6,
        marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2,
      }}
    >
      <Text style={{ flex: 1, fontSize: 16 }}>{item.text}</Text>
      <TouchableOpacity onPress={() => startEdit(index)} style={{ marginRight: 10 }}>
        <MaterialIcons name="edit" size={22} color="#4A90E2" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteNote(index)}>
        <MaterialIcons name="delete" size={22} color="red" />
      </TouchableOpacity>
    </View>
  );

  // Main UI
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFF1" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#000",
          paddingTop: Constants.statusBarHeight || 40, // <-- Add this line
          paddingVertical: width * 0.09,
          paddingHorizontal: width * 0.05,
          alignItems: "center",
          borderBottomWidth: 0.5,
          borderBottomColor: "#fff",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: width * 0.08,
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {selectedFolder ? selectedFolder.name : "Folders"}
        </Text>
      </View>

      {/* Folders List */}
      {!selectedFolder && (
        <>
          <TouchableOpacity
            style={{
              margin: 16,
              backgroundColor: "#9CA37C",
              padding: 14,
              borderRadius: 10,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
            onPress={() => setFolderModal(true)}
          >
            <MaterialIcons name="create-new-folder" size={24} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 16, marginLeft: 8 }}>Add Folder</Text>
          </TouchableOpacity>
          <FlatList
            data={folders}
            renderItem={renderFolder}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingVertical: 16 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
                No folders yet. Add your first folder!
              </Text>
            }
          />
        </>
      )}

      {/* Notes List */}
      {selectedFolder && (
        <>
          {/* Back Button */}
          <TouchableOpacity
            style={{
              margin: 16,
              backgroundColor: "#E0E0E0",
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
              flexDirection: "row",
              width: 100,
            }}
            onPress={() => setSelectedFolder(null)}
          >
            <MaterialIcons name="arrow-back" size={20} color="#000" />
            <Text style={{ color: "#000", fontSize: 16, marginLeft: 6 }}>Back</Text>
          </TouchableOpacity>

          {/* Input */}
          <View
            style={{
              flexDirection: "row",
              margin: 16,
              marginBottom: 0,
              alignItems: "center",
            }}
          >
            <TextInput
              placeholder="Add a note..."
              value={noteInput}
              onChangeText={setNoteInput}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 10,
                padding: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
              onSubmitEditing={editIdx !== null ? saveEdit : addNote}
            />
            <TouchableOpacity
              onPress={editIdx !== null ? saveEdit : addNote}
              style={{
                marginLeft: 10,
                backgroundColor: "#9CA37C",
                padding: 12,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons name={editIdx !== null ? "save" : "add"} size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Notes List */}
          <FlatList
            data={notes}
            renderItem={renderItem}
            keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
            contentContainerStyle={{ paddingVertical: 16 }}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
                No notes yet. Add your first note!
              </Text>
            }
          />

          {/* Edit Modal */}
          <Modal visible={modalVisible} transparent animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  paddingTop: Constants.statusBarHeight || 40, // <-- Add this line if you want
                  padding: 20,
                  borderRadius: 15,
                  width: "80%",
                }}
              >
                <TextInput
                  placeholder="Edit note"
                  value={noteInput}
                  onChangeText={setNoteInput}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 10,
                    padding: 10,
                    marginBottom: 20,
                  }}
                  onSubmitEditing={saveEdit}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#9CA37C",
                    padding: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                  onPress={saveEdit}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ marginTop: 10, alignItems: "center" }}
                  onPress={() => {
                    setModalVisible(false);
                    setEditIdx(null);
                    setNoteInput("");
                  }}
                >
                  <Text style={{ color: "red" }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}

      {/* Folder Modal */}
      <Modal visible={folderModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              paddingTop: Constants.statusBarHeight || 40, // <-- Add this line if you want
              padding: 20,
              borderRadius: 15,
              width: "80%",
            }}
          >
            <TextInput
              placeholder="Folder name"
              value={folderInput}
              onChangeText={setFolderInput}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 10,
                padding: 10,
                marginBottom: 20,
              }}
              onSubmitEditing={addFolder}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#9CA37C",
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
              }}
              onPress={addFolder}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Add Folder</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10, alignItems: "center" }}
              onPress={() => {
                setFolderModal(false);
                setFolderInput("");
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

export default StudyMaterialPage;
