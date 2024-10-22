// screens/SettingsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const [name, setName] = useState('');
  const [hostel, setHostel] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('Name');
        const storedHostel = await AsyncStorage.getItem('Hostel');
        if (storedName !== null) setName(storedName);
        if (storedHostel !== null) setHostel(storedHostel);
      } catch (error) {
        console.error('Failed to load data from AsyncStorage', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.info}>Name: {name}</Text>
      <Text style={styles.info}>Hostel: {hostel}</Text>
      <Button title="Go to Greetings" onPress={() => navigation.navigate('GreetingsScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  info: {
    fontSize: 18,
    color: '#fff',
  },
});