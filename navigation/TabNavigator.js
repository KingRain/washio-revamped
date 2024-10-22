import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import BookingScreen from "../screens/BookingScreen";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#000", // Black background color
          height: 80,
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#21c056", // Purple color for active tabs
        tabBarInactiveTintColor: "#333",
        headerShown: false, // Remove screen name on the top
      })}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "home-sharp" : "home-outline"}
                size={32} // Increased size of icons
                color={focused ? "#21c056" : "gray"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "add-circle-sharp" : "add-circle-outline"}
                size={32} // Increased size of icons
                color={focused ? "#21c056" : "gray"}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? "settings-sharp" : "settings-outline"}
                size={32} // Increased size of icons
                color={focused ? "#21c056" : "gray"}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});
