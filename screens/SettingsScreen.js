import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import AsyncStorage from "@react-native-async-storage/async-storage";

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

async function onGoogleSignOut(setUser) {
  ReactNativeHapticFeedback.trigger("impactHeavy", options);
  try {
    await GoogleSignin.signOut();
    setUser(null);
  } catch (error) {
    console.error("Error during Google sign-out:", error);
  }
}

async function resetData() {
  ReactNativeHapticFeedback.trigger("impactHeavy", options);
  try {
    await AsyncStorage.removeItem("hostelName");
    await AsyncStorage.removeItem("roomNumber");
    console.log("Data reset successfully");
  } catch (error) {
    console.error("Error resetting data:", error);
  }
}

export default function SettingsScreen({ user, setUser }) {
  const [hostelName, setHostelName] = useState(null);
  const [roomNumber, setRoomNumber] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const storedHostelName = await AsyncStorage.getItem("hostelName");
        const storedRoomNumber = await AsyncStorage.getItem("roomNumber");
        if (storedHostelName) setHostelName(storedHostelName);
        if (storedRoomNumber) setRoomNumber(storedRoomNumber);
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      }
    }
    fetchData();
  }, []);

  const formatName = (name) => {
    if (!name) return "N/A";
    return name.replace("-IIITK", "").trim();
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headingtext}>Settings</Text>
        <Text style={styles.subheading}>User Information</Text>
        <View style={styles.userInfoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.valueOutline}>
              <Text style={styles.value}>{formatName(user?.name)}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.valueOutline}>
              <Text style={styles.value}>{user?.email || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>RoomNo</Text>
            <View style={styles.valueOutline}>
              <Text style={styles.value}>{roomNumber || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Hostel</Text>
            <View style={styles.valueOutline}>
              <Text style={styles.value}>{hostelName || "N/A"}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onGoogleSignOut(setUser)}
        >
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
        {user?.email === "samchalissery24bcs41@iiitkottayam.ac.in" && (
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={resetData}
          >
            <Text style={styles.buttonText}>Reset Data</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#040703",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#040703",
    paddingTop: 12,
  },
  headingtext: {
    fontSize: 32,
    color: "#EAF5E7",
    fontFamily: "DelaGothicOne-Regular",
    marginBottom: 29,
    marginLeft: 16,
    alignSelf: "flex-start",
  },
  subheading: {
    fontSize: 28,
    color: "#EAF5E7",
    fontFamily: "Inter-ExtraBold",
    marginBottom: 16,
    marginLeft: 16,
    alignSelf: "flex-start",
  },
  userInfoContainer: {
    backgroundColor: "#040703",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
    width: "100%",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  valueOutline: {
    borderWidth: 1,
    borderColor: "#EAF5E7",
    borderRadius: 4,
    padding: 5,
    width: 257,
  },
  label: {
    fontSize: 16,
    color: "#EAF5E7",
    fontFamily: "Inter-Bold",
  },
  value: {
    fontSize: 14,
    marginLeft: 10,
    color: "#EAF5E7",
    fontFamily: "Inter-Regular",
  },
  button: {
    backgroundColor: "#F05B5B",
    height: 44,
    width: "90%",
    borderRadius: 12,
    marginTop: 80,
    padding: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-Medium",
    textAlign: "center",
  },
  resetButton: {
    backgroundColor: "#FFA500",
    marginTop: 20,
  },
});
