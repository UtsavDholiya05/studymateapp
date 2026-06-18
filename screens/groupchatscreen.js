import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  StatusBar,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useSocket } from "../context/SocketContext";

const { height, width } = Dimensions.get("window");

const GroupChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId, groupName, groupOwner } = route.params;
  
  const { socket, setActiveGroupId } = useSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("user123");
  const [currentUserName, setCurrentUserName] = useState("You");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [currentUserAvatar, setCurrentUserAvatar] = useState("https://randomuser.me/api/portraits/men/1.jpg");
  const flatListRef = useRef();

  const MESSAGES_STORAGE_KEY = `@group_chat_${groupId}`;
  const MEMBERS_STORAGE_KEY = `@group_members_${groupId}`;

  // Load user info, messages and members
  useEffect(() => {
    const initializeChat = async () => {
      try {
        let userId = "user123";
        let userName = "You";
        let userAvatar = "https://randomuser.me/api/portraits/men/1.jpg";

        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user.username) userName = user.username;
          if (user.email) userId = user.email;
          if (user.profileImage) userAvatar = user.profileImage;
        }

        setCurrentUserId(userId);
        setCurrentUserName(userName);
        setCurrentUserAvatar(userAvatar);

        // Load messages
        const savedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          setMessages([
            {
              id: "1",
              text: "Hey everyone! Let's study together",
              senderName: "Sarah",
              senderId: "user1",
              timestamp: "10:30am",
              avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            },
            {
              id: "2",
              text: "I'm in! Let's focus on Chapter 5",
              senderName: userName,
              senderId: userId,
              timestamp: "10:35am",
              avatar: userAvatar,
            },
            {
              id: "3",
              text: "Great! See you at the study session",
              senderName: "John",
              senderId: "user2",
              timestamp: "10:40am",
              avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            },
          ]);
        }

        // Load members
        const savedMembers = await AsyncStorage.getItem(MEMBERS_STORAGE_KEY);
        if (savedMembers) {
          setMembers(JSON.parse(savedMembers));
        } else {
          setMembers([
            {
              id: userId,
              name: userName,
              avatar: userAvatar,
              role: "Member",
            },
            {
              id: "user1",
              name: "Sarah",
              avatar: "https://randomuser.me/api/portraits/women/1.jpg",
              role: "Admin",
            },
            {
              id: "user2",
              name: "John",
              avatar: "https://randomuser.me/api/portraits/men/2.jpg",
              role: "Member",
            },
            {
              id: "user3",
              name: "Emma",
              avatar: "https://randomuser.me/api/portraits/women/2.jpg",
              role: "Member",
            },
          ]);
        }
      } catch (e) {
        console.error("Error initializing group chat data:", e);
      }
    };

    initializeChat();
  }, [groupId]);

  // Save messages when updated
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Save members when updated
  useEffect(() => {
    if (members.length > 0) {
      AsyncStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
    }
  }, [members]);

  // Register active group and listen for real-time messages
  useEffect(() => {
    setActiveGroupId(String(groupId));

    const handleIncomingMessage = ({ groupId: incomingGroupId, message }) => {
      if (String(incomingGroupId) === String(groupId)) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        
        // Auto-scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    };

    socket.on("group_message", handleIncomingMessage);

    return () => {
      setActiveGroupId(null);
      socket.off("group_message", handleIncomingMessage);
    };
  }, [groupId, setActiveGroupId, socket]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      senderName: currentUserName,
      senderId: currentUserId,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: currentUserAvatar,
    };

    socket.emit("group_message", {
      groupId,
      groupName,
      message: newMessage,
    });

    setInput("");
  };

  const addNewMember = () => {
    if (!newMemberName.trim()) {
      alert("Please enter member name");
      return;
    }

    // Check if member already exists
    if (members.some(m => m.name.toLowerCase() === newMemberName.toLowerCase())) {
      alert("Member already exists in this group");
      return;
    }

    const newMember = {
      id: "user" + Date.now(),
      name: newMemberName.trim(),
      email: newMemberEmail.trim() || "user@example.com",
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
      role: "Member",
    };

    setMembers([...members, newMember]);
    setNewMemberName("");
    setNewMemberEmail("");
    setShowAddMember(false);
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === currentUserId;

    return (
      <View
        style={{
          marginVertical: width * 0.02,
          marginHorizontal: width * 0.03,
          flexDirection: isMyMessage ? "row-reverse" : "row",
          alignItems: "flex-end",
        }}
      >
        {!isMyMessage && (
          <Image
            source={{ uri: item.avatar }}
            style={{
              width: width * 0.09,
              height: width * 0.09,
              borderRadius: width * 0.045,
              marginHorizontal: width * 0.02,
            }}
          />
        )}

        <View
          style={{
            backgroundColor: isMyMessage ? "#b5b88f" : "#fff",
            borderRadius: width * 0.02,
            paddingHorizontal: width * 0.03,
            paddingVertical: width * 0.02,
            maxWidth: "75%",
            minWidth: 60,
            elevation: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 1,
          }}
        >
          {!isMyMessage && (
            <Text style={{ color: "#b5b88f", fontSize: 12, fontWeight: "600", marginBottom: 4 }}>
              {item.senderName}
            </Text>
          )}
          <Text style={{ color: "#222", fontSize: width * 0.04 }}>
            {item.text}
          </Text>
          <Text
            style={{
              color: isMyMessage ? "#222" : "#888",
              fontSize: width * 0.03,
              marginTop: 4,
              textAlign: "right",
            }}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
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
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 12 }}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              color="#444"
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#222",
                fontFamily: "PlayfairDisplay_400Regular",
                fontSize: width * 0.055,
                fontWeight: "bold",
              }}
            >
              {groupName}
            </Text>
            <Text style={{ color: "#666", fontSize: width * 0.035 }}>
              {members.length} members
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowMembers(true)}
          style={{ marginLeft: 12 }}
        >
          <Ionicons name="people" size={width * 0.07} color="#444" />
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={{
          flex: 1,
          backgroundColor: "#f5f5ef",
          borderTopLeftRadius: width * 0.04,
          borderTopRightRadius: width * 0.04,
          paddingTop: width * 0.03,
        }}
      >
        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 20 }}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: height * 0.3,
              }}
            >
              <Text style={{ color: "#888", fontSize: 16 }}>
                No messages yet. Start the conversation!
              </Text>
            </View>
          }
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Input Bar */}
        <View
          style={{
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
              paddingVertical: width * 0.02,
              fontSize: width * 0.04,
              marginRight: width * 0.02,
              color: "#000",
              fontWeight: "400",
            }}
            placeholder="Type a message..."
            placeholderTextColor="#888"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
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
        </View>
      </KeyboardAvoidingView>

      {/* Members Modal */}
      <Modal visible={showMembers} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            paddingTop: height * 0.15,
          }}
        >
          <View
            style={{
              backgroundColor: "#f5f5ef",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: height * 0.75,
              paddingTop: 20,
              borderWidth: 1,
              borderColor: "#d1d1c0",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: "#222",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Group Members ({members.length})
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setShowAddMember(true)}
                  style={{
                    backgroundColor: "#b5b88f",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#444", fontWeight: "600", fontSize: 12 }}>
                    + Add
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMembers(false)}>
                  <Ionicons name="close" size={28} color="#222" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ paddingHorizontal: 16 }}
            >
              {members.map((member) => (
                <View
                  key={member.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1c0",
                  }}
                >
                  <Image
                    source={{ uri: member.avatar }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      marginRight: 12,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: "#222",
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      {member.name}
                    </Text>
                    <Text style={{ color: "#666", fontSize: 12 }}>
                      {member.role}
                    </Text>
                  </View>
                  {member.role === "Admin" && (
                    <View
                      style={{
                        backgroundColor: "#b5b88f",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "#444",
                          fontSize: 11,
                          fontWeight: "600",
                        }}
                      >
                        Admin
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Member Modal */}
      <Modal visible={showAddMember} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#f5f5ef",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 30,
              paddingBottom: 40,
              borderWidth: 1,
              borderColor: "#d1d1c0",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  color: "#222",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Add Member to Group
              </Text>
              <TouchableOpacity onPress={() => setShowAddMember(false)}>
                <Ionicons name="close" size={28} color="#222" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Member Name"
              placeholderTextColor="#888"
              value={newMemberName}
              onChangeText={setNewMemberName}
              style={{
                backgroundColor: "#fff",
                color: "#000",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 10,
                marginBottom: 12,
                fontSize: 14,
                borderWidth: 1,
                borderColor: "#d1d1c0",
              }}
            />

            <TextInput
              placeholder="Email (Optional)"
              placeholderTextColor="#888"
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              keyboardType="email-address"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 10,
                marginBottom: 20,
                fontSize: 14,
                borderWidth: 1,
                borderColor: "#d1d1c0",
              }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowAddMember(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#e6e6d8",
                  paddingVertical: 14,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#222", fontWeight: "600", fontSize: 14 }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addNewMember}
                style={{
                  flex: 1,
                  backgroundColor: "#b5b88f",
                  paddingVertical: 14,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#444", fontWeight: "600", fontSize: 14 }}>
                  Add Member
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupChatScreen;
