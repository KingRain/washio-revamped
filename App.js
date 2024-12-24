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
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
