import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

const { width } = Dimensions.get("window");

const FolderDetailScreen = ({ route, navigation }) => {
  const { folder, updateFolder } = route.params;
  const [files, setFiles] = useState(folder.files || []);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const addImage = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        const newFiles = [...files, { type: "image", uri }];
        setFiles(newFiles);
        updateFolder({ ...folder, files: newFiles });
        Alert.alert("Success", "Image added!");
      }
    } catch (e) {
      Alert.alert("Error", "Could not add image.");
    }
    setLoading(false);
  };

  const addPdf = async () => {
    setLoading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newFiles = [...files, { type: "pdf", uri: asset.uri, name: asset.name }];
        setFiles(newFiles);
        updateFolder({ ...folder, files: newFiles });
        Alert.alert("Success", "PDF added!");
      }
    } catch (e) {
      Alert.alert("Error", "Could not add PDF.");
    }
    setLoading(false);
  };

  // Open PDF in external app
  const openPdf = async (uri, name = "file.pdf") => {
    if (Platform.OS === "android") {
      try {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: uri,
          flags: 1,
          type: "application/pdf",
        });
      } catch (e) {
        Alert.alert("Error", "No PDF viewer found or cannot open PDF.");
      }
    } else {
      Linking.openURL(uri);
    }
  };

  // Delete handlers
  const deleteFile = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    updateFolder({ ...folder, files: newFiles });
  };

  // Separate images and pdfs for better UI
  const images = files.filter(f => f.type === "image");
  const pdfs = files.filter(f => f.type === "pdf");

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFF1" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#000",
          paddingTop: Constants.statusBarHeight || 40,
          paddingVertical: width * 0.06,
          paddingHorizontal: width * 0.05,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 0.5,
          borderBottomColor: "#fff",
          position: "relative",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back-ios"
            size={22}
            color="#9CA37C"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
            top: width * 0.02,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "PlayfairDisplay_400Regular",
              fontSize: width * 0.08,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            {folder.name}
          </Text>
        </View>
      </View>

      {/* Upload Buttons */}
      <View style={{ flexDirection: "row", margin: 20, justifyContent: "center" }}>
        <Button title="Add Image" onPress={addImage} />
        <View style={{ width: 10 }} />
        <Button title="Add PDF" onPress={addPdf} />
      </View>

      {loading && (
        <ActivityIndicator size="large" color="#9CA37C" style={{ marginVertical: 10 }} />
      )}

      <ScrollView contentContainerStyle={{ padding: 10 }}>
        {/* Images Section */}
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>Images</Text>
        {images.length === 0 && (
          <Text style={{ color: "#888", marginBottom: 10 }}>No images uploaded.</Text>
        )}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {images.map((img, idx) => (
            <View key={idx} style={{ position: "relative" }}>
              <TouchableOpacity
                onPress={() => setPreviewImage(img.uri)}
                style={{
                  width: (width - 60) / 3,
                  height: (width - 60) / 3,
                  margin: 5,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {img.uri ? (
                  <Image
                    source={{ uri: img.uri }}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "cover",
                    }}
                  />
                ) : (
                  <MaterialIcons name="broken-image" size={40} color="#ccc" />
                )}
              </TouchableOpacity>
              {/* Delete icon */}
              <TouchableOpacity
                onPress={() => deleteFile(files.findIndex(f => f === img))}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 2,
                  zIndex: 2,
                }}
              >
                <MaterialIcons name="delete" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: "#ccc",
            marginVertical: 20,
            marginHorizontal: 10,
          }}
        />

        {/* PDFs Section */}
        <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}>PDFs</Text>
        {pdfs.length === 0 && (
          <Text style={{ color: "#888", marginBottom: 10 }}>No PDFs uploaded.</Text>
        )}
        {pdfs.map((pdf, idx) => (
          <View key={idx} style={{ position: "relative" }}>
            <TouchableOpacity
              onPress={() => openPdf(pdf.uri, pdf.name)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: 10,
                marginVertical: 5,
                borderRadius: 8,
                elevation: 2,
              }}
            >
              <MaterialIcons name="picture-as-pdf" size={28} color="#9CA37C" />
              <Text style={{ marginLeft: 10, color: "#222", fontSize: 16 }}>
                {pdf.name || "PDF File"}
              </Text>
            </TouchableOpacity>
            {/* Delete icon */}
            <TouchableOpacity
              onPress={() => deleteFile(files.findIndex(f => f === pdf))}
              style={{
                position: "absolute",
                top: 2,
                right: 2,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 2,
                zIndex: 2,
              }}
            >
              <MaterialIcons name="delete" size={20} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal visible={!!previewImage} transparent onRequestClose={() => setPreviewImage(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ position: 'absolute', top: 40, right: 20, zIndex: 2 }} onPress={() => setPreviewImage(null)}>
            <MaterialIcons name="close" size={36} color="#fff" />
          </TouchableOpacity>
          {previewImage && (
            <Image source={{ uri: previewImage }} style={{ width: width * 0.9, height: width * 1.2, resizeMode: 'contain' }} />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default FolderDetailScreen;