import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, useWindowDimensions, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Camera } from 'expo-camera';

export default function VideoCallScreen({ navigation }) {
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } = await Camera.requestMicrophonePermissionsAsync();
      if (cameraStatus !== 'granted' || micStatus !== 'granted') {
        Alert.alert(
          'Permissions Required',
          'Camera and microphone access are required for video calls.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: height * 0.08, paddingHorizontal: width * 0.05 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="arrow-back-ios" size={24} color="black" />
          <Text style={styles.headerText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Video Call</Text>
        <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
      </View>
      {/* WebView */}
      <View style={styles.webviewContainer}>
        <WebView
          source={{ uri: 'https://whereby.com/studymateapp' }}
          style={styles.webview}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFF1",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFF1",
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 16,
    color: "black",
    fontFamily: "Inconsolata_400Regular",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "PlayfairDisplay_400Regular",
    textAlign: "center",
    flex: 1,
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    marginHorizontal: 10,
    marginBottom: 10,
    elevation: 3,
  },
  webview: {
    flex: 1,
  },
});