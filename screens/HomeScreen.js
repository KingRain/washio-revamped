import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Icon from "react-native-vector-icons/Ionicons";
import SettingsScreen from "./SettingsScreen";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const Tab = createBottomTabNavigator();
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

function Header({ user, onSignOut }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>WASHIO</Text>
      <View style={styles.userContainer}>
        <View style={styles.userBadge}>
          <Text style={styles.smallText}>Basic</Text>
        </View>
        <TouchableOpacity>
          <Image source={{ uri: user?.photo }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeTab({ user }) {
  const [announcementImages, setAnnouncementImages] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "https://samjoe.tech/AnnouncementData.json"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAnnouncementImages(data.images);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleFloorClick = (floor) => {
    ReactNativeHapticFeedback.trigger("impactLight", options);
    navigation.navigate("SlotView", { floor, user });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headingtext}>Announcements</Text>
      <View style={styles.scrollView}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.announcementScrollContainer}
        >
          {announcementImages.map((image, index) => (
            <ImageBackground
              key={index}
              source={{ uri: image }}
              style={styles.announcementContainer}
              imageStyle={styles.announcementImage}
              height={145}
              width={370}
            >
              <Text style={styles.announcementText}>
                Announcement {index + 1}
              </Text>
            </ImageBackground>
          ))}
        </ScrollView>
      </View>
      <View style={styles.herotextcontainer}>
        <Text style={styles.herotext}>Select your</Text>
        <Text style={styles.herotext}>
          Floor<Text style={{ color: "#B0D9A4" }}>.</Text>
        </Text>
      </View>

      <View style={styles.floorContainer}>
        {[0, 1, 2].map((floor) => (
          <TouchableOpacity
            key={floor}
            style={styles.floorButton}
            onPress={() => handleFloorClick(floor)}
          >
            <Text style={styles.buttonText}>{floor}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen({ user, setUser }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [hostelName, setHostelName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  useEffect(() => {
    const checkUserData = async () => {
      const storedHostelName = await AsyncStorage.getItem("hostelName");
      const storedRoomNumber = await AsyncStorage.getItem("roomNumber");

      if (!storedHostelName || !storedRoomNumber) {
        setModalVisible(true); // Show popup if data is missing
      } else {
        setHostelName(storedHostelName);
        setRoomNumber(storedRoomNumber);
      }
    };

    checkUserData();
  }, []);

  const handleSave = async () => {
    if (hostelName && roomNumber) {
      await AsyncStorage.setItem("hostelName", hostelName);
      await AsyncStorage.setItem("roomNumber", roomNumber);
      setModalVisible(false); // Close the popup
    } else {
      alert("Please fill in both fields.");
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Header user={user} />

      {/* Popup Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modelSubContainer}>
            <Text style={styles.modalHeading}>Hello there! 👋</Text>
            <Text style={styles.modelsubText}>
              Please fill out these details
            </Text>
            <Text style={styles.modalLabel}>Select Hostel Name:</Text>
            <Picker
              selectedValue={hostelName}
              style={styles.picker}
              onValueChange={(itemValue) => setHostelName(itemValue)}
            >
              <Picker.Item
                style={styles.pickerItem}
                label="Select Hostel"
                value=""
              />
              <Picker.Item
                style={styles.pickerItem}
                label="Kalapurackal Hostel"
                value="Kalapurackal Hostel"
              />
              <Picker.Item
                style={styles.pickerItem}
                label="Nila Block B"
                value="Nila Block B"
              />
              <Picker.Item
                style={styles.pickerItem}
                label="Maryland"
                value="Maryland"
              />
              <Picker.Item
                style={styles.pickerItem}
                label="Anna Residency"
                value="Anna Residency"
              />
              <Picker.Item
                style={styles.pickerItem}
                label="Kalapurackal Apartments"
                value="Kalapurackal Apartments"
              />
            </Picker>
            <Text style={styles.modalLabel}>Enter Room Number:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter Room Number"
              value={roomNumber}
              onChangeText={(text) => setRoomNumber(text)}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSave()}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: "#EAF5E7",
          tabBarInactiveTintColor: "#474747",
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === "HomeScreen") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Settings") {
              iconName = focused ? "settings" : "settings-outline";
            }
            return (
              <Icon
                name={iconName}
                size={30}
                color={color}
                style={styles.navicons}
              />
            );
          },
        })}
      >
        <Tab.Screen name="HomeScreen">
          {() => <HomeTab user={user} />}
        </Tab.Screen>
        <Tab.Screen name="Settings">
          {(props) => (
            <SettingsScreen {...props} user={user} setUser={setUser} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#040703",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0B0C0B",
    padding: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
    borderBottomColor: "#474747",
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 24,
    color: "#EAF5E7",
    fontFamily: "DelaGothicOne-Regular",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userBadge: {
    borderWidth: 1,
    borderColor: "#EAF5E7",
    borderRadius: 4,
    padding: 5,
    marginRight: 12,
  },
  smallText: {
    fontSize: 12,
    color: "#EAF5E7",
    fontFamily: "Inter-Regular",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#040703",
    paddingTop: 12,
  },
  scrollView: {
    flexDirection: "row",
  },
  announcementContainer: {
    width: 370,
    height: 145,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#EAF5E7",
  },
  announcementScrollContainer: {
    height: 145,
    paddingHorizontal: 16, // For spacing between images
    marginBottom: 0, // Prevent extra spacing below the ScrollView
  },

  announcementImage: {
    borderRadius: 12,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  announcementText: {
    fontSize: 18,
    fontFamily: "DelaGothicOne-Regular",
    color: "#EAF5E7",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 5,
  },
  headingtext: {
    fontSize: 24,
    color: "#EAF5E7",
    fontFamily: "DelaGothicOne-Regular",
    marginBottom: 12,
    marginLeft: 16,
    alignSelf: "flex-start",
  },
  herotext: {
    fontSize: 48,
    color: "#EAF5E7",
    fontFamily: "DelaGothicOne-Regular",
    marginBottom: 12,
    alignContent: "left",
  },
  herotextcontainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginTop: 47,
    marginBottom: 47, // Reduce spacing between the announcements and the text
  },
  floorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  floorButton: {
    width: 100,
    height: 100,
    backgroundColor: "#0B0C0B",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAF5E7",
    marginHorizontal: 9,
  },
  buttonText: {
    fontSize: 40,
    color: "#EAF5E7",
    fontFamily: "DelaGothicOne-Regular",
  },
  tabBar: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    borderRadius: 12,
    margin: 14,
    height: 60,
    backgroundColor: "#0F100F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    borderBottomColor: "#474747",
    borderWidth: 1,
  },
  iconContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  navicons: {
    width: 30,
    height: "100%",
    marginTop: "25%",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent background
  },
  modelSubContainer: {
    backgroundColor: "#0F100E",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeading: {
    fontSize: 24,
    color: "#EAF5E7",
    fontFamily: "DelaGothicOne-Regular",
    marginBottom: 10,
    textAlign: "center",
  },
  modelsubText: {
    fontSize: 14,
    color: "#EAF5E7",
    fontFamily: "Inter-Regular",
    marginBottom: 40,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 16,
    color: "#EAF5E7",
    fontFamily: "Inter-Bold",
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  picker: {
    width: "100%",
    color: "#EAF5E7",
    backgroundColor: "#0F100E",
    borderRadius: 4,
    marginBottom: 12,
    padding: 4,
    borderColor: "#EAF5E7",
    borderWidth: 1,
  },
  pickerItem: {
    color: "#EAF5E7",
    backgroundColor: "#0F100E",
    fontFamily: "Inter-Regular",
  },
  input: {
    width: "100%",
    backgroundColor: "#0F100E",
    color: "#EAF5E7",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B0D9A4",
    marginBottom: 10,
    fontFamily: "Inter-Regular",
  },
  saveButton: {
    backgroundColor: "#A4FB8C",
    height: 44,
    width: "100%",
    borderRadius: 12,
    marginTop: 60,
    padding: 10,
  },
  saveButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "Inter-Bold",
    textAlign: "center",
  },
});
