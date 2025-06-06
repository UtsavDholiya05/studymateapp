import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import homepage from './Homepage';
import profilepage from './profilepage';
import mygroups from './mygroups';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#D3D3D3', borderRadius: 20, margin: 10, height: 40 },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarIconStyle: { marginTop: 5 },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={homepage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={profilepage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={mygroups}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="group" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;