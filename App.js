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
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="GreetingsScreen" component={GreetingsScreen} />
        ) : (
          <Stack.Screen name="HomeScreen" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
