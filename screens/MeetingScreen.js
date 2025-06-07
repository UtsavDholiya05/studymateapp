import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Button,
  ScrollView,
  Clipboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

const { height, width } = Dimensions.get("window");
const BASE_ROOM_PREFIX = "studymateapp-";

const MeetingScreen = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [userName, setUserName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // For unique meeting creation/join
  const [createdRoomCode, setCreatedRoomCode] = useState("");
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);

  // Scheduled calls state
  const [scheduledCalls, setScheduledCalls] = useState([]);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [selectedCallId, setSelectedCallId] = useState(null);

  // Recording state
  const [recording, setRecording] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [recordingModalVisible, setRecordingModalVisible] = useState(false);

  // Load scheduled calls from AsyncStorage on mount
  useEffect(() => {
    const loadScheduledCalls = async () => {
      const stored = await AsyncStorage.getItem("scheduledCalls");
      if (stored) setScheduledCalls(JSON.parse(stored));
      else setScheduledCalls([
        { id: 1, title: "AI Study Group Call", date: "2025-06-06 10:00 AM" },
        { id: 2, title: "Web Dev Team Sync", date: "2025-06-07 3:00 PM" },
      ]);
    };
    loadScheduledCalls();
  }, []);

  // Save scheduled calls to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem("scheduledCalls", JSON.stringify(scheduledCalls));
  }, [scheduledCalls]);

  // Load recordings from AsyncStorage on mount
  useEffect(() => {
    const loadRecordings = async () => {
      const stored = await AsyncStorage.getItem("meetingRecordings");
      if (stored) setRecordings(JSON.parse(stored));
    };
    loadRecordings();
  }, []);

  // Save recordings to AsyncStorage whenever they change
  useEffect(() => {
    AsyncStorage.setItem("meetingRecordings", JSON.stringify(recordings));
  }, [recordings]);

  const cardData = [
    {
      title: "New Meeting",
      icon: (
        <Ionicons
          name="videocam"
          size={width * 0.1}
          color="#000"
          style={{ alignSelf: "center" }}
        />
      ),
      backgroundColor: "#9CA37C",
    },
    {
      title: "Join Meeting",
      icon: (
        <AntDesign
          name="plussquare"
          size={width * 0.1}
          color="black"
          style={{ alignSelf: "center" }}
        />
      ),
      backgroundColor: "#FFFFF1",
    },
    {
      title: "Schedule",
      icon: (
        <MaterialIcons
          name="schedule"
          size={width * 0.1}
          color="#000"
          style={{ alignSelf: "center" }}
        />
      ),
      backgroundColor: "#FFFFF1",
    },
    {
      title: "Recording",
      icon: (
        <MaterialCommunityIcons
          name="record-rec"
          size={width * 0.1}
          color={recording ? "red" : "#000"}
          style={{ alignSelf: "center" }}
        />
      ),
      backgroundColor: "#FFFFF1",
    },
  ];

  // Add a new scheduled call
  const scheduleMeeting = () => {
    if (!meetingTitle.trim()) {
      alert("Please enter a meeting name.");
      return;
    }
    const code = BASE_ROOM_PREFIX + Date.now();
    setScheduledCalls([
      ...scheduledCalls,
      {
        id: Date.now(),
        title: meetingTitle,
        date: format(date, "dd MMM yyyy • hh:mm a"),
        code, // store the meeting code
      },
    ]);
    setScheduleModalVisible(false);
    setMeetingTitle("");
    setDate(new Date());
  };

  // Rename a scheduled call
  const renameScheduledCall = () => {
    if (!meetingTitle.trim()) {
      alert("Please enter a meeting name.");
      return;
    }
    setScheduledCalls(
      scheduledCalls.map((call) =>
        call.id === selectedCallId ? { ...call, title: meetingTitle } : call
      )
    );
    setRenameModalVisible(false);
    setMeetingTitle("");
    setSelectedCallId(null);
  };

  // Delete a scheduled call
  const deleteScheduledCall = (id) => {
    setScheduledCalls(scheduledCalls.filter((call) => call.id !== id));
  };

  // --- NEW MEETING LOGIC ---
  const handleNewMeeting = () => {
    // Generate a unique room code
    const code = BASE_ROOM_PREFIX + Date.now();
    setCreatedRoomCode(code);
    setShowNewMeetingModal(true);
  };

  const handleCopyLink = () => {
    const link = `https://whereby.com/${createdRoomCode}`;
    if (Clipboard && Clipboard.setString) {
      Clipboard.setString(link);
      alert("Copied!", "Meeting link copied to clipboard.");
    }
  };

  const handleStartMeeting = () => {
    setShowNewMeetingModal(false);
    navigation.navigate("videocall", { roomCode: createdRoomCode });
    setCreatedRoomCode("");
  };

  // --- JOIN MEETING LOGIC ---
  const handleJoinMeeting = () => {
    if (!meetingId.trim()) {
      alert("Please enter a meeting code.");
      return;
    }
    setModalVisible(false);
    navigation.navigate("videocall", { roomCode: meetingId.trim() });
    setMeetingId("");
    setUserName("");
  };

  // Start recording
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      alert("Failed to start recording: " + err.message);
    }
  };

  // Stop recording and save
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordings([...recordings, { uri, date: new Date() }]);
      setRecording(null);
      alert("Recording saved!");
    } catch (err) {
      alert("Failed to stop recording: " + err.message);
    }
  };

  // Delete a recording
  const deleteRecording = (idx) => {
    const updated = [...recordings];
    updated.splice(idx, 1);
    setRecordings(updated);
  };

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

      {/* Title Banner */}
      <TouchableOpacity
        style={{
          backgroundColor: "#FFFFF1",
          marginHorizontal: width * 0.02,
          marginTop: 10,
          padding: 20,
          borderRadius: 10,
          shadowColor: "#000",
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          position: "relative",
          height: height * 0.18,
        }}
        activeOpacity={1}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            alignSelf: "flex-start",
            position: "absolute",
            paddingLeft: width * 0.03,
            paddingTop: height * 0.02,
          }}
        >
          {/* <MaterialIcons
            name="arrow-back-ios"
            size={width * 0.07}
            color="black"
          /> */}
        </TouchableOpacity>

        <View style={{ flex: 0, alignSelf: "flex-end" }}>
          <Text
            style={{
              color: "#000",
              fontSize: width * 0.15,
              fontWeight: "bold",
              fontFamily: "PlayfairDisplay_400Regular",
              transform: [
                { translateY: width * 0.03 },
                { translateX: -width * 0.02 },
              ],
              letterSpacing: -2,
            }}
          >
            Meetings
          </Text>
        </View>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text
            style={{
              color: "#000",
              fontSize: width * 0.03,
              transform: [
                { translateX: -width * 0.15 },
                { translateY: -width * 0.01 },
              ],
            }}
          >
            {"meet up,\nget going"}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Cards Grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          padding: width * 0.02,
        }}
      >
        {cardData.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={{
              backgroundColor: card.backgroundColor,
              width: "48.5%",
              marginVertical: width * 0.02,
              padding: 20,
              borderRadius: 10,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
              height: height * 0.13,
              justifyContent: "space-between",
            }}
            onPress={() => {
              if (card.title === "Join Meeting") {
                setModalVisible(true);
              } else if (card.title === "Schedule") {
                setScheduleModalVisible(true);
              } else if (card.title === "New Meeting") {
                handleNewMeeting();
              } else if (card.title === "Recording") {
                setRecordingModalVisible(true);
              }
            }}
          >
            {card.icon}
            <Text
              style={{
                color: "#000",
                fontSize: width * 0.05,
                fontWeight: "bold",
                fontFamily: "Inter_400Regular",
                alignSelf: "center",
              }}
            >
              {card.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scheduled Calls Section */}
      <View style={{ marginVertical: -width * 0.02, padding: width * 0.02 }}>
        <View
          style={{
            backgroundColor: "#FFFFF1",
            width: "100%",
            padding: height * 0.01,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
            maxHeight: height * 0.35, // Make the section bigger and scrollable
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 28,
                fontFamily: "Inter_400Regular",
                letterSpacing: -2,
              }}
            >
              Scheduled Calls
            </Text>
            <TouchableOpacity
              onPress={() => setScheduleModalVisible(true)}
              style={{
                backgroundColor: "#9CA37C",
                paddingVertical: 6,
                paddingHorizontal: 16,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Schedule</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 1.5,
              backgroundColor: "#000",
              marginTop: height * 0.002,
              width: "100%",
              marginBottom: 10,
            }}
          />
          {/* Scrollable scheduled calls */}
          <ScrollView>
            {scheduledCalls.length === 0 ? (
              <Text style={{ color: "#888" }}>No scheduled calls.</Text>
            ) : (
              scheduledCalls.map((call) => (
                <View
                  key={call.id}
                  style={{
                    backgroundColor: "#e7e7d9",
                    padding: width * 0.035,
                    borderRadius: width * 0.02,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: width * 0.045, fontWeight: "500" }}>
                    {call.title}
                  </Text>
                  <Text style={{ fontSize: width * 0.035, color: "#555" }}>
                    {call.date}
                  </Text>
                  <Text
                    selectable
                    style={{
                      color: "#566D67",
                      fontWeight: "bold",
                      marginTop: 6,
                      fontFamily: "Inconsolata_400Regular",
                    }}
                  >
                    https://whereby.com/{call.code}
                  </Text>
                  <Text
                    style={{
                      color: "#222",
                      fontWeight: "bold",
                      marginBottom: 6,
                      fontFamily: "Inconsolata_400Regular",
                      fontSize: 13,
                    }}
                  >
                    Code: {call.code}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#566D67",
                        borderRadius: 8,
                        paddingVertical: 6,
                        paddingHorizontal: 14,
                        marginRight: 6,
                        marginBottom: 6,
                      }}
                      onPress={() => {
                        if (Clipboard && Clipboard.setString) {
                          Clipboard.setString(`https://whereby.com/${call.code}`);
                          Alert.alert("Copied!", "Meeting link copied to clipboard.");
                        }
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>Copy Link</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#9CA37C",
                        borderRadius: 8,
                        paddingVertical: 6,
                        paddingHorizontal: 14,
                        marginRight: 6,
                        marginBottom: 6,
                      }}
                      onPress={() => {
                        if (Clipboard && Clipboard.setString) {
                          Clipboard.setString(call.code);
                          Alert.alert("Copied!", "Meeting code copied to clipboard.");
                        }
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>Copy Code</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#9CA37C",
                        borderRadius: 8,
                        paddingVertical: 6,
                        paddingHorizontal: 14, 
                        marginRight: 6,
                        marginBottom: 6,
                      }}
                      onPress={() => {
                        navigation.navigate("videocall", { roomCode: call.code });
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>Start</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10 }}>
                    <TouchableOpacity
                      onPress={() => {
                        setRenameModalVisible(true);
                        setSelectedCallId(call.id);
                        setMeetingTitle(call.title);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        borderWidth: 1.5,
                        borderColor: "#9CA37C",
                        paddingVertical: 8,
                        alignItems: "center",
                        marginRight: 6,
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 6,
                        shadowColor: "#9CA37C",
                        shadowOpacity: 0.08,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <MaterialIcons name="edit" size={18} color="#9CA37C" />
                      <Text style={{ color: "#9CA37C", fontWeight: "bold", fontSize: 15 }}>
                        Rename
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteScheduledCall(call.id)}
                      style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: 8,
                        borderWidth: 1.5,
                        borderColor: "#FF6B6B",
                        paddingVertical: 8,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 6,
                        shadowColor: "#FF6B6B",
                        shadowOpacity: 0.08,
                        shadowRadius: 2,
                        elevation: 2,
                      }}
                    >
                      <MaterialIcons name="delete" size={18} color="#FF6B6B" />
                      <Text style={{ color: "#FF6B6B", fontWeight: "bold", fontSize: 15 }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>

      {/* Join Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
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
              borderRadius: 10,
              padding: 20,
              width: "70%",
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 10,
              // height: "35%", // Remove fixed height for better keyboard handling
            }}
          >
            <Text
              style={{
                fontSize: 28,
                marginBottom: height * 0.04,
                fontFamily: "Inter_400Regular",
              }}
            >
              Join a Meeting
            </Text>

            <TextInput
              placeholder="Meeting code"
              placeholderTextColor="#666"
              value={meetingId}
              onChangeText={setMeetingId}
              style={{
                borderWidth: 1,
                borderColor: "#000",
                borderRadius: 10,
                padding: 10,
                marginBottom: 20,
                fontFamily: "Inconsolata_400Regular",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              <TouchableOpacity
                onPress={handleJoinMeeting}
                style={{
                  backgroundColor: "#9CA37C",
                  borderRadius: 10,
                  width: width * 0.25,
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                  }}
                >
                  Join
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  width: width * 0.25,
                  borderColor: "#666",
                  borderWidth: 1,
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* New Meeting Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showNewMeetingModal}
        onRequestClose={() => setShowNewMeetingModal(false)}
      >
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
              borderRadius: 10,
              padding: 20,
              width: "70%",
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 10,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 24,
                marginBottom: 10,
                fontFamily: "Inter_400Regular",
                fontWeight: "bold",
              }}
            >
              New Meeting Created!
            </Text>
            <Text
              style={{
                fontSize: 16,
                marginBottom: 10,
                textAlign: "center",
                fontFamily: "Inconsolata_400Regular",
              }}
            >
              Share this link with others to join:
            </Text>
            <Text
              selectable
              style={{
                color: "#566D67",
                fontWeight: "bold",
                marginBottom: 6,
                fontFamily: "Inconsolata_400Regular",
                textAlign: "center",
              }}
            >
              https://whereby.com/{createdRoomCode}
            </Text>
            <Text
              style={{
                color: "#222",
                fontWeight: "bold",
                marginBottom: 10,
                fontFamily: "Inconsolata_400Regular",
                textAlign: "center",
                fontSize: 15,
                letterSpacing: 1,
              }}
            >
              Meeting Code: {createdRoomCode}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#566D67",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                width: "100%",
                alignItems: "center",
              }}
              onPress={handleCopyLink}
            >
              <Text style={{ color: "#fff" }}>Copy Link</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#9CA37C",
                padding: 10,
                borderRadius: 10,
                marginBottom: 10,
                width: "100%",
                alignItems: "center",
              }}
              onPress={() => {
                if (Clipboard && Clipboard.setString) {
                  Clipboard.setString(createdRoomCode);
                  Alert.alert("Copied!", "Meeting code copied to clipboard.");
                }
              }}
            >
              <Text style={{ color: "#fff" }}>Copy Code</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#9CA37C",
                padding: 12,
                borderRadius: 10,
                width: "100%",
                alignItems: "center",
                marginTop: 5,
              }}
              onPress={handleStartMeeting}
            >
              <Text style={{ color: "#fff" }}>Start Meeting</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10, alignItems: "center" }}
              onPress={() => setShowNewMeetingModal(false)}
            >
              <Text style={{ color: "red" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Schedule Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={scheduleModalVisible}
        onRequestClose={() => setScheduleModalVisible(false)}
      >
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
              borderRadius: 16,
              padding: 24,
              width: "85%",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 12,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                marginBottom: height * 0.02,
                fontFamily: "Inter_400Regular",
              }}
            >
              Schedule
            </Text>

            <TextInput
              placeholder="Meeting name"
              placeholderTextColor="#999"
              value={meetingTitle}
              onChangeText={setMeetingTitle}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
                fontFamily: "Inconsolata_400Regular",
              }}
            />

            {/* Modern Styled Date & Time Picker */}
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 12,
                padding: 12,
                marginBottom: 20,
                backgroundColor: "#F8F8F8",
                gap: 8,
              }}
            >
              <MaterialCommunityIcons name="calendar" size={20} color="#444" />
              <Text
                style={{
                  fontFamily: "Inconsolata_400Regular",
                  color: "#222",
                  fontSize: 16,
                }}
              >
                {format(date, "dd MMM yyyy")} • {format(date, "hh:mm a")}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="datetime"
                is24Hour={false}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDate(selectedDate);
                }}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              <TouchableOpacity
                onPress={scheduleMeeting}
                style={{
                  backgroundColor: "#9CA37C",
                  borderRadius: 12,
                  width: width * 0.25,
                  borderColor: "#666",
                  borderWidth: 1,
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                  }}
                >
                  Schedule
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setScheduleModalVisible(false)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  width: width * 0.25,
                  borderColor: "#666",
                  borderWidth: 1,
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rename Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={renameModalVisible}
        onRequestClose={() => setRenameModalVisible(false)}
      >
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
              borderRadius: 16,
              padding: 24,
              width: "85%",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 12,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                marginBottom: height * 0.02,
                fontFamily: "Inter_400Regular",
              }}
            >
              Rename Call
            </Text>

            <TextInput
              placeholder="Meeting name"
              placeholderTextColor="#999"
              value={meetingTitle}
              onChangeText={setMeetingTitle}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 12,
                padding: 12,
                marginBottom: 20,
                fontFamily: "Inconsolata_400Regular",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
              }}
            >
              <TouchableOpacity
                onPress={renameScheduledCall}
                style={{
                  backgroundColor: "#9CA37C",
                  borderRadius: 12,
                  width: width * 0.25,
                  borderColor: "#666",
                  borderWidth: 1,
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                  }}
                >
                  Rename
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRenameModalVisible(false)}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  width: width * 0.25,
                  borderColor: "#666",
                  borderWidth: 1,
                  alignItems: "center",
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    color: "#000",
                    fontFamily: "Inter_400Regular",
                    fontSize: 16,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Recording Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={recordingModalVisible}
        onRequestClose={() => setRecordingModalVisible(false)}
      >
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
              borderRadius: 16,
              padding: 24,
              width: "90%",
              maxHeight: "80%",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
              Meeting Recordings
            </Text>
            <TouchableOpacity
              onPress={recording ? stopRecording : startRecording}
              style={{
                backgroundColor: recording ? "#FF6B6B" : "#9CA37C",
                borderRadius: 10,
                padding: 16,
                marginBottom: 16,
                width: "80%",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {recording ? "Stop Recording" : "Start Recording"}
              </Text>
            </TouchableOpacity>
            <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
              Saved Recordings:
            </Text>
            <ScrollView style={{ maxHeight: 200, width: "100%" }}>
              {recordings.length === 0 ? (
                <Text style={{ color: "#888", textAlign: "center" }}>No recordings yet.</Text>
              ) : (
                recordings.map((rec, idx) => (
                  <View
                    key={idx}
                    style={{
                      marginBottom: 14,
                      backgroundColor: "#f6f6e9",
                      borderRadius: 8,
                      padding: 10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, color: "#333" }}>
                        {rec.date
                          ? format(new Date(rec.date), "dd MMM yyyy, hh:mm a")
                          : ""}
                      </Text>
                      <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                        <TouchableOpacity
                          onPress={async () => {
                            const sound = new Audio.Sound();
                            await sound.loadAsync({ uri: rec.uri });
                            await sound.playAsync();
                          }}
                          style={{
                            backgroundColor: "#566D67",
                            borderRadius: 8,
                            paddingVertical: 6,
                            paddingHorizontal: 14,
                            marginRight: 6,
                          }}
                        >
                          <Text style={{ color: "#fff", fontWeight: "bold" }}>
                            ▶ Play
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => deleteRecording(idx)}
                          style={{
                            backgroundColor: "#FF6B6B",
                            borderRadius: 8,
                            paddingVertical: 6,
                            paddingHorizontal: 14,
                          }}
                        >
                          <Text style={{ color: "#fff", fontWeight: "bold" }}>
                            🗑 Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setRecordingModalVisible(false)}
              style={{
                marginTop: 16,
                backgroundColor: "#fff",
                borderRadius: 10,
                borderColor: "#666",
                borderWidth: 1,
                alignItems: "center",
                paddingVertical: 10,
                width: "80%",
              }}
            >
              <Text style={{ color: "#000", fontWeight: "bold" }}>Close</Text>
            </TouchableOpacity>
            <Text style={{ color: "#888", marginTop: 10, fontSize: 12, textAlign: "center" }}>
              * Only audio recording is supported in Expo. For screen recording, use a native app or OS feature.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MeetingScreen;
