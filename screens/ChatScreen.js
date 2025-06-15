import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");

const getTimeString = (date) => {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 === 0 ? 12 : h % 12;
  const min = m < 10 ? `0${m}` : m;
  return `Today, ${hour}:${min}${ampm}`;
};

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user = "Sender", avatar = "https://randomuser.me/api/portraits/women/44.jpg" } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef();

  const STORAGE_KEY = `@chat_${user}`;

  // Load messages from AsyncStorage
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setMessages(JSON.parse(saved));
        else {
          // Demo messages
          setMessages([
            {
              id: 1,
              text: "Lorem ipsum dolor sit",
              fromMe: false,
              time: "Today, 8:30am",
            },
            {
              id: 2,
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore",
              fromMe: true,
              time: "Today, 8:30am",
            },
            {
              id: 3,
              text: "Lorem ipsum dolor sit amet,",
              fromMe: true,
              time: "Today, 9:30am",
            },
            {
              id: 4,
              text: "Lorem ipsum dolor sit",
              fromMe: false,
              time: "Today, 8:30pm",
            },
          ]);
        }
      } catch (e) {}
    };
    loadMessages();
  }, [user]);

  // Save messages to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      const now = new Date();
      setMessages([
        ...messages,
        {
          id: Date.now(),
          text: input,
          fromMe: true,
          time: getTimeString(now),
        },
      ]);
      setInput("");
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#b5b88f" }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#d1d1c0",
          paddingTop: width * 0.13,
          paddingBottom: width * 0.04,
          paddingHorizontal: width * 0.04,
          flexDirection: "row",
          alignItems: "center",
          borderBottomWidth: 1,
          borderBottomColor: "#b5b88f",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={width * 0.08}
            color="#444"
            style={{ marginRight: width * 0.02 }}
          />
        </TouchableOpacity>
        <Image
          source={{ uri: avatar }}
          style={{
            width: width * 0.12,
            height: width * 0.12,
            borderRadius: width * 0.06,
            marginRight: width * 0.03,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: "#222",
              fontFamily: "PlayfairDisplay_400Regular",
              fontSize: width * 0.055,
              fontWeight: "bold",
            }}
          >
            {user}
          </Text>
          <Text style={{ color: "#666", fontSize: width * 0.035 }}>Online</Text>
        </View>
        <View
          style={{
            width: width * 0.045,
            height: width * 0.045,
            borderRadius: width * 0.0225,
            backgroundColor: "#222",
            marginLeft: width * 0.01,
          }}
        />
      </View>

      {/* Chat Area */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#f5f5ef",
          borderTopLeftRadius: width * 0.04,
          borderTopRightRadius: width * 0.04,
          paddingTop: width * 0.03,
        }}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: width * 0.04, paddingBottom: 120 }}
          renderItem={({ item }) => (
            <View style={{ marginBottom: width * 0.025 }}>
              <View
                style={{
                  alignSelf: item.fromMe ? "flex-end" : "flex-start",
                  backgroundColor: item.fromMe ? "#b5b88f" : "#fff",
                  borderRadius: width * 0.02,
                  padding: width * 0.03,
                  maxWidth: "75%",
                  minWidth: 60,
                }}
              >
                <Text style={{ color: "#222", fontSize: width * 0.04 }}>
                  {item.text}
                </Text>
              </View>
              <Text
                style={{
                  alignSelf: item.fromMe ? "flex-end" : "flex-start",
                  color: "#888",
                  fontSize: width * 0.03,
                  marginTop: 2,
                  marginLeft: item.fromMe ? 0 : 6,
                  marginRight: item.fromMe ? 6 : 0,
                }}
              >
                {item.time}
              </Text>
            </View>
          )}
        />

        {/* Input at Bottom */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#e6e6d8",
            borderTopWidth: 1,
            borderColor: "#d1d1c0",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: width * 0.03,
            paddingVertical: height * 0.012,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              backgroundColor: "#f5f5ef",
              borderRadius: width * 0.02,
              borderWidth: 0,
              paddingHorizontal: width * 0.04,
              paddingVertical: width * 0.02, // Add some vertical padding
              fontSize: width * 0.04,
              marginRight: width * 0.02,
              color: "#000", // Make text darker for better contrast
              fontWeight: "400", // Add slightly bolder font
            }}
            placeholder="type your message here"
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={{
              backgroundColor: "#b5b88f",
              padding: width * 0.025,
              borderRadius: width * 0.04,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="send" size={width * 0.06} color="#444" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
      <Text style={{position: 'absolute', top: -20, left: 10, color: 'red'}}>
        Text: {input}
      </Text>
    </View>
  );
};

export default ChatScreen;