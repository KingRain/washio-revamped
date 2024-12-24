<<<<<<< Updated upstream
// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TabNavigator from './navigation/TabNavigator';
import GreetingsScreen from './screens/GreetingsScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const userName = await AsyncStorage.getItem('Name');
        if (userName) {
          setIsFirstLaunch(false);
        } else {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('Name', 'User'); // Set a value to indicate the app has been launched
        }
      } catch (e) {
        console.log(e);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isFirstLaunch === null) {
    return null;
=======
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import SlotViewScreen from "./screens/SlotViewScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  const [fontsLoaded] = useFonts({
    "Inter-Thin": require("./assets/fonts/Inter_28pt-Thin.ttf"),
    "Inter-ExtraLight": require("./assets/fonts/Inter_28pt-ExtraLight.ttf"),
    "Inter-Light": require("./assets/fonts/Inter_28pt-Light.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter_28pt-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter_28pt-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter_28pt-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter_28pt-Bold.ttf"),
    "Inter-ExtraBold": require("./assets/fonts/Inter_28pt-ExtraBold.ttf"),
    "DelaGothicOne-Regular": require("./assets/fonts/DelaGothicOne-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null; // or a loading spinner
>>>>>>> Stashed changes
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
<<<<<<< Updated upstream
        {isFirstLaunch ? (
          <Stack.Screen name="GreetingsScreen" component={GreetingsScreen} />
        ) : (
          <Stack.Screen name="HomeScreen" component={TabNavigator} />
        )}
=======
        {!user ? (
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setUser={setUser} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} user={user} setUser={setUser} />}
          </Stack.Screen>
        )}
        <Stack.Screen name="SlotView" component={SlotViewScreen} />
>>>>>>> Stashed changes
      </Stack.Navigator>
    </NavigationContainer>
  );
}
