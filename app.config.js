import "dotenv/config";

export default {
  expo: {
    name: "washio-twoo",
    slug: "washio-twoo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#040703",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#040703",
        googleServicesFile: "./google-services.json",
      },
      package: "com.httperror.washiotwoo",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "@react-native-google-signin/google-signin",
      "expo-font",
    ],
    extra: {
      eas: {
        projectId: "3c911097-a680-43a1-9b6b-9a15d4390291",
      },
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      googleClientId: process.env.GOOGLE_WEB_CLIENTID,
    },
    assetBundlePatterns: ["**/*"],
  },
};
