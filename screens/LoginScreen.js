import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import Constants from "expo-constants";
const { googleClientId } = Constants.expoConfig.extra;

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

async function onGoogleButtonPress(setUser) {
  ReactNativeHapticFeedback.trigger("impactHeavy", options);
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignin.signIn();
    const idToken = signInResult?.data?.idToken;
    if (!idToken) {
      throw new Error("No ID token found in the response.");
    }
    const userEmail = signInResult.data.user.email;
    const isInstitutionEmail = userEmail.split("@")[1] === "iiitkottayam.ac.in";
    if (isInstitutionEmail) {
      setUser(signInResult.data.user);
    } else {
      await GoogleSignin.signOut();
      Alert.alert(
        "Invalid Email",
        "Please use your institution email to login.",
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  } catch (error) {
    console.error("Error during Google sign-in:", error);
  }
}

export default function LoginScreen({ setUser }) {
  GoogleSignin.configure({
    webClientId: googleClientId,
    offlineAccess: true,
  });

  return (
    <View style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.container}>
        <View style={styles.container2}>
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/icons/app-icon.png")}
              style={styles.icon}
            />
          </View>
          {[...Array(5)].map((_, index) => (
            <View key={index} style={styles.dot} />
          ))}
          <View style={styles.iconContainer}>
            <Image
              source={require("../assets/icons/google-icon.png")}
              style={styles.icon}
            />
          </View>
        </View>
        <Text style={styles.title}>Login</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onGoogleButtonPress(setUser)}
        >
          <Text style={styles.buttonText}>Sign-In with Google</Text>
        </TouchableOpacity>
        <Text style={{ color: "#EAF5E7", position: "absolute", bottom: 40 }}>
          Use your institution mail for login
        </Text>
        <Text style={{ color: "#EAF5E7", position: "absolute", bottom: 20 }}>
          Powered by ErrorCorp
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#040703",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#040703",
  },
  container2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconContainer: {
    padding: 10,
  },
  icon: {
    height: 78,
    width: 78,
    borderRadius: 69,
    borderWidth: 1,
    borderColor: "#EAF5E7",
  },
  dot: {
    height: 7.8,
    width: 7.8,
    borderRadius: 5,
    backgroundColor: "#EAF5E7",
    marginHorizontal: 5,
  },
  title: {
    fontSize: 64,
    marginBottom: 20,
    color: "#EAF5E7",
    fontFamily: "DelaGothicOne-Regular",
  },
  button: {
    backgroundColor: "#040703",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAF5E7",
  },
  buttonText: {
    color: "#EAF5E7",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    fontWeight: "semibold",
  },
});
