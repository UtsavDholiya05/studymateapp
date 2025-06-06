import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Linking,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

const API_KEY = Constants.expoConfig.extra.YT_API_KEY;

const Edushorts = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchYouTubeShorts = async () => {
    if (!searchQuery.trim()) {
      alert("Please enter a search query.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&videoDuration=short&key=${API_KEY}&maxResults=10`
      );
      const data = await response.json();

      if (data.items) {
        setShorts(data.items);
      } else {
        alert("No results found.");
      }
    } catch (error) {
      console.error("Error fetching YouTube Shorts:", error);
      alert("Failed to fetch YouTube Shorts.");
    }

    setLoading(false);
  };

  const renderShort = ({ item }) => (
    <TouchableOpacity
      style={styles.shortContainer}
      onPress={() => {
        const videoUrl = `https://www.youtube.com/watch?v=${item.id.videoId}`;
        Linking.openURL(videoUrl);
      }}
    >
      <Image
        source={{ uri: item.snippet.thumbnails.medium.url }}
        style={styles.thumbnail}
      />
      <View style={styles.shortDetails}>
        <Text style={styles.title} numberOfLines={2}>
          {item.snippet.title}
        </Text>
        <Text style={styles.channel}>{item.snippet.channelTitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
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

      {/* Search Section */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search YouTube Shorts"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchYouTubeShorts}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}

      {/* Shorts List */}
      <FlatList
        data={shorts}
        renderItem={renderShort}
        keyExtractor={(item) => item.id.videoId}
        contentContainerStyle={styles.shortsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: width * 0.05,
    paddingTop: width * 0.1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    marginBottom: width * 0.05,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  headerText: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "PlayfairDisplay_400Regular",
  },
  searchSection: {
    flexDirection: "row",
    marginBottom: width * 0.05,
    backgroundColor: "#FFFFF1",
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: width * 0.02,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    color: "#000",
    fontFamily: "Inter_400Regular",
    paddingVertical: width * 0.02,
  },
  searchButton: {
    backgroundColor: "#9CA37C",
    paddingVertical: width * 0.03,
    paddingHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width * 0.04,
    fontFamily: "Inter_400Regular",
  },
  loadingText: {
    textAlign: "center",
    marginVertical: width * 0.05,
    fontSize: width * 0.04,
    color: "#9CA37C",
    fontFamily: "Inter_400Regular",
  },
  shortsList: {
    paddingBottom: width * 0.05,
  },
  shortContainer: {
    marginBottom: width * 0.05,
    borderRadius: width * 0.02,
    overflow: "hidden",
    backgroundColor: "#FFFFF1",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  thumbnail: {
    width: "100%",
    height: width * 0.5,
  },
  shortDetails: {
    padding: width * 0.03,
  },
  title: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#000",
    marginBottom: width * 0.01,
    fontFamily: "Inter_400Regular",
  },
  channel: {
    fontSize: width * 0.035,
    color: "#666",
    fontFamily: "Inter_400Regular",
  },
});

export default Edushorts;