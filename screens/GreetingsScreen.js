import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function GreetingsScreen({ navigation }) {
  const [name, setName] = useState('');
  const [hostel, setHostel] = useState('');

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('Name', name);
      await AsyncStorage.setItem('Hostel', hostel);
      navigation.replace('HomeScreen');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Washio! <Text style={styles.wave}>👋</Text></Text>
      <Text style={styles.text}>Enter your name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#aaa"
      />
      <Text style={styles.text}>Select your hostel:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={hostel}
          style={styles.picker}
          onValueChange={(itemValue) => setHostel(itemValue)}
        >
          <Picker.Item label="Kalapurakkal" value="KH" />
          <Picker.Item label="Nila Block B" value="NB" />
          <Picker.Item label="Anna Residency" value="AR" />
          <Picker.Item label="Kalapurakkal Apartments" value="KA" />
          <Picker.Item label="Meenachil" value="MN" />
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Save & Continue"
          onPress={handleSave}
          disabled={!name || !hostel}
          color="hsl(174, 100%, 33%)"
          borderRadius={10}
          borderColor="#000000"
        />
      </View>
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
  wave: {
    fontSize: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 20,
    borderRadius: 10,
    color: '#fff',
    backgroundColor: '#444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  pickerContainer: {
    width: '80%',
    borderRadius: 10,
    backgroundColor: '#444',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  picker: {
    height: 50,
    color: '#fff',
  },
});