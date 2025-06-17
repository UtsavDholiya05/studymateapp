import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Kanit_400Regular } from "@expo-google-fonts/kanit";
import { Inconsolata_400Regular } from "@expo-google-fonts/inconsolata";
import { PlayfairDisplay_400Regular } from "@expo-google-fonts/playfair-display";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import your screens
import LoginScreen from "./screens/loginscreen";
import SignupScreen from "./screens/signupscreen";
import ForgotPass from "./screens/forgotpass";
import OtpScreen from "./screens/otpscreen";
import Homepage from "./screens/Homepage";
import ProfilePage from "./screens/profilepage";
import MyGroups from "./screens/mygroups";
import EditProfilePage from "./screens/EditProfilePage";
import Notification from "./screens/notification";
import MeetingScreen from "./screens/MeetingScreen";
import CustomDrawer from "./screens/customDrawer";
import StudyMaterialPage from "./screens/notes";
import EduShorts from "./screens/Edushorts";
import ToDoList from "./screens/ToDoList";
import FolderDetailScreen from "./screens/FolderDetailScreen";
import VideoCall from "./screens/videocall";
import ChatScreen from "./screens/chatscreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Stack navigator for Home tab
function HomeStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Homepage" component={Homepage} />
      <Stack.Screen name="meetingscreen" component={MeetingScreen} />
      <Stack.Screen name="studymaterial" component={require("./screens/studymaterial").default} />
      <Stack.Screen name="Edushorts" component={EduShorts} />
      <Stack.Screen name="ToDoList" component={ToDoList} />
      <Stack.Screen name="FolderDetail" component={FolderDetailScreen} />
      <Stack.Screen name="videocall" component={VideoCall} />
      <Stack.Screen name="mygroups" component={MyGroups} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="profilepage" component={ProfilePage} />
      <Stack.Screen name="editprofilepage" component={EditProfilePage} />
      <Stack.Screen name='notes' component={require("./screens/notes").default} />
      
    </Stack.Navigator>
  );
}

// Stack navigator for Groups tab
function GroupsStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyGroups" component={MyGroups} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

// Stack navigator for Notifications tab
function NotificationsStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notification" component={Notification} />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator - This goes INSIDE the drawer
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#9CA37C",
        tabBarInactiveTintColor: "#888",
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: "PlayfairDisplay_400Regular",
          fontSize: width * 0.035,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: "#fafaea",
          borderTopWidth: 1,
          borderTopColor: "#b5b88f",
          height: width * 0.18,
          paddingBottom: width * 0.03,
          paddingTop: width * 0.01,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <Ionicons name="home-outline" size={size * 1.1} color={color} />;
          }
          if (route.name === "Groups") {
            return <Ionicons name="people-outline" size={size * 1.1} color={color} />;
          }
          if (route.name === "Notifications") {
            return <Ionicons name="notifications-outline" size={size * 1.1} color={color} />;
          }
          if (route.name === "Profile") {
            return <Ionicons name="person-outline" size={size * 1.1} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      {/* <Tab.Screen name="Groups" component={GroupsStackScreen} /> */}
      <Tab.Screen name="Notifications" component={NotificationsStackScreen} />
      <Tab.Screen name="Profile" component={ProfilePage} />
    </Tab.Navigator>
  );
}

// Drawer navigator that contains the bottom tabs
function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{ 
        headerShown: false,
        drawerStyle: {
          width: "75%",
          backgroundColor: "#fafaea",
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={MainTabNavigator} />
      <Drawer.Screen name="EditProfile" component={EditProfilePage} />
      {/* Add other screens you want accessible from drawer but not tabs */}
    </Drawer.Navigator>
  );
}

// Root Stack - Auth flows before drawer+tabs
export default function App() {
  const [fontsLoaded] = useFonts({
    Kanit_400Regular,
    Inconsolata_400Regular,
    PlayfairDisplay_400Regular,
    Inter_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainApp" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        {/* After login/OTP, navigate to MainDrawer which contains tabs */}
        <Stack.Screen name="MainApp" component={MainDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}