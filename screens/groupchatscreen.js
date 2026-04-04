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

const { height, width } = Dimensions.get("window");

const GroupChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId, groupName, groupOwner } = route.params;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [members, setMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("user123");
  const [currentUserName, setCurrentUserName] = useState("You");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const flatListRef = useRef();

  const MESSAGES_STORAGE_KEY = `@group_chat_${groupId}`;
  const MEMBERS_STORAGE_KEY = `@group_members_${groupId}`;

  // Load current user info
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const userName = await AsyncStorage.getItem("userName");
        if (userId) setCurrentUserId(userId);
        if (userName) setCurrentUserName(userName);
      } catch (e) {
        console.error("Error loading user info:", e);
      }
    };
    loadUserInfo();
  }, []);

  // Load messages and members
  useEffect(() => {
    const loadChatData = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem(MESSAGES_STORAGE_KEY);
        const savedMembers = await AsyncStorage.getItem(MEMBERS_STORAGE_KEY);

        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        } else {
          // Demo messages
          setMessages([
            {
              id: 1,
              text: "Hey everyone! Let's study together",
              senderName: "Sarah",
              senderId: "user1",
              timestamp: "10:30am",
              avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            },
            {
              id: 2,
              text: "I'm in! Let's focus on Chapter 5",
              senderName: "You",
              senderId: "user123",
              timestamp: "10:35am",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            {
              id: 3,
              text: "Great! See you at the study session",
              senderName: "John",
              senderId: "user2",
              timestamp: "10:40am",
              avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            },
          ]);
        }

        if (savedMembers) {
          setMembers(JSON.parse(savedMembers));
        } else {
          // Default members
          setMembers([
            {
              id: "user123",
              name: "You",
              avatar: "https://randomuser.me/api/portraits/men/1.jpg",
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
        console.error("Error loading chat data:", e);
      }
    };
    loadChatData();
  }, []);

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
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
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
          marginVertical: 8,
          marginHorizontal: 12,
          flexDirection: isMyMessage ? "row-reverse" : "row",
          alignItems: "flex-end",
        }}
      >
        {!isMyMessage && (
          <Image
            source={{ uri: item.avatar }}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              marginHorizontal: 8,
            }}
          />
        )}

        <View
          style={{
            backgroundColor: isMyMessage ? "#9CA37C" : "#2a2a2a",
            borderRadius: 16,
            paddingHorizontal: 12,
            paddingVertical: 8,
            maxWidth: "75%",
          }}
        >
          {!isMyMessage && (
            <Text style={{ color: "#9CA37C", fontSize: 12, fontWeight: "600", marginBottom: 4 }}>
              {item.senderName}
            </Text>
          )}
          <Text style={{ color: isMyMessage ? "#000" : "#fff", fontSize: 14 }}>
            {item.text}
          </Text>
          <Text
            style={{
              color: isMyMessage ? "#000" : "#999",
              fontSize: 11,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#1a1a1a",
          paddingVertical: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottomWidth: 1,
          borderBottomColor: "#333",
          paddingTop: height * 0.02,
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
              color="#9CA37C"
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {groupName}
            </Text>
            <Text style={{ color: "#999", fontSize: 12 }}>
              {members.length} members
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setShowMembers(true)}
          style={{ marginLeft: 12 }}
        >
          <Ionicons name="people" size={24} color="#9CA37C" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 12 }}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: height * 0.3,
            }}
          >
            <Text style={{ color: "#666", fontSize: 16 }}>
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
          flexDirection: "row",
          padding: 12,
          backgroundColor: "#1a1a1a",
          borderTopWidth: 1,
          borderTopColor: "#333",
          alignItems: "flex-end",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#2a2a2a",
            color: "#fff",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderRadius: 20,
            marginRight: 8,
            maxHeight: 100,
          }}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            backgroundColor: "#9CA37C",
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="send" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Members Modal */}
      <Modal visible={showMembers} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            paddingTop: height * 0.15,
          }}
        >
          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: height * 0.75,
              paddingTop: 20,
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
                  color: "#fff",
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
                    backgroundColor: "#9CA37C",
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#000", fontWeight: "600", fontSize: 12 }}>
                    + Add
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowMembers(false)}>
                  <Ionicons name="close" size={28} color="#fff" />
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
                    borderBottomColor: "#2a2a2a",
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
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: "600",
                      }}
                    >
                      {member.name}
                    </Text>
                    <Text style={{ color: "#999", fontSize: 12 }}>
                      {member.role}
                    </Text>
                  </View>
                  {member.role === "Admin" && (
                    <View
                      style={{
                        backgroundColor: "#9CA37C",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                      }}
                    >
                      <Text
                        style={{
                          color: "#000",
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
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#1a1a1a",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 30,
              paddingBottom: 40,
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
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                Add Member to Group
              </Text>
              <TouchableOpacity onPress={() => setShowAddMember(false)}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Member Name"
              placeholderTextColor="#666"
              value={newMemberName}
              onChangeText={setNewMemberName}
              style={{
                backgroundColor: "#2a2a2a",
                color: "#fff",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 10,
                marginBottom: 12,
                fontSize: 14,
              }}
            />

            <TextInput
              placeholder="Email (Optional)"
              placeholderTextColor="#666"
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              keyboardType="email-address"
              style={{
                backgroundColor: "#2a2a2a",
                color: "#fff",
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 10,
                marginBottom: 20,
                fontSize: 14,
              }}
            />

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setShowAddMember(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#2a2a2a",
                  paddingVertical: 14,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={addNewMember}
                style={{
                  flex: 1,
                  backgroundColor: "#9CA37C",
                  paddingVertical: 14,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#000", fontWeight: "600", fontSize: 14 }}>
                  Add Member
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default GroupChatScreen;
