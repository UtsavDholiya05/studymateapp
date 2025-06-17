import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Kanit_400Regular } from "@expo-google-fonts/kanit";
import { Inconsolata_400Regular } from "@expo-google-fonts/inconsolata";
import LoginScreen from "./screens/loginscreen";
import SignupScreen from "./screens/signupscreen";
import ForgotPass from "./screens/forgotpass";
import OtpScreen from "./screens/otpscreen";
import Homepage from "./screens/Homepage"; 
import profilepage from "./screens/profilepage";
import mygroups from "./screens/mygroups";
import EditProfilePage from "./screens/EditProfilePage"; 
import notification from "./screens/notification";
import { PlayfairDisplay_400Regular } from "@expo-google-fonts/playfair-display";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import MeetingScreen from "./screens/MeetingScreen";
import CustomDrawer from "./screens/customDrawer";
import studymaterialpage from "./screens/notes";
import Edushorts from "./screens/Edushorts"; 
import ToDoList from "./screens/ToDoList";
import FolderDetailScreen from "./screens/FolderDetailScreen";
import videocall from "./screens/videocall";
import chatscreen from "./screens/chatscreen";
import { View, Text, Dimensions } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const { width } = Dimensions.get("window");

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const MainScreensStack = createStackNavigator();
function MainScreensStackScreen() {
  return (
    <MainScreensStack.Navigator screenOptions={{ headerShown: false }}>
      <MainScreensStack.Screen name="Homepage" component={Homepage} />
      <MainScreensStack.Screen name="profilepage" component={profilepage} />
      <MainScreensStack.Screen name="mygroups" component={mygroups} />
      <MainScreensStack.Screen name="editprofilepage" component={EditProfilePage} />
      <MainScreensStack.Screen name="meetingscreen" component={MeetingScreen} />
      <MainScreensStack.Screen name="notes" component={require("./screens/studymaterial").default} />
      <MainScreensStack.Screen name="studymaterial" component={studymaterialpage} />
      <MainScreensStack.Screen name="Edushorts" component={Edushorts} />
      <MainScreensStack.Screen name="ToDoList" component={ToDoList} />
      <MainScreensStack.Screen name="FolderDetail" component={FolderDetailScreen} />
      <MainScreensStack.Screen name="videocall" component={videocall} />
      <MainScreensStack.Screen name="notification" component={notification} />
      <MainScreensStack.Screen name="
      
      " component={chatscreen} />
    </MainScreensStack.Navigator>
  );
}

// Bottom Tab Navigator styled to match your app
function BottomTabNavigator() {
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
          if (route.name === "Notifications") {
            return <Ionicons name="notifications-outline" size={size * 1.1} color={color} />;
          }
          if (route.name === "Settings") {
            return <Feather name="settings" size={size * 1.1} color={color} />;
          }
          if (route.name === "EditProfile") {
            return <Ionicons name="person-outline" size={size * 1.1} color={color} />;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={MainScreensStackScreen} />
      <Tab.Screen name="Notifications" component={NotificationStackScreen} />
      <Tab.Screen name="EditProfile" component={EditProfilePage} />
      {/* <Tab.Screen name="Settings" component={Settings} /> */}
    </Tab.Navigator>
  );
}

// Add this function to create a stack for notifications
function NotificationStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="NotificationScreen" component={notification} />
      <Stack.Screen name="chatscreen" component={chatscreen} />
    </Stack.Navigator>
  );
}

// In your login/signup flow, after successful login, use:
// navigation.replace("MainTabs");

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
    return null; // You can replace this with a loading indicator
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: "100%",
            backgroundColor: "#111",
          },
          overlayColor: "rgba(0,0,0,0.3)",
        }}
      >
        <Drawer.Screen name="Main" component={BottomTabNavigator} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
