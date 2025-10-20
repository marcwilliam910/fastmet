export default {
  "expo": {
    "name": "FastMet",
    "slug": "fastmet",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/fastmet/icon.png",
    "scheme": "fastmet",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "config": {
        "googleMapsApiKey": process.env.EXPO_PUBLIC_IOS_MAP_KEY,
      },
      "supportsTablet": true,
      "bundleIdentifier": "com.guildsman.fastmet",
      "googleServicesFile": "./GoogleService-Info.plist",
      "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false,
      },
    },
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": process.env.EXPO_PUBLIC_ANDROID_MAP_KEY,
        },
      },
      "adaptiveIcon": {
        "foregroundImage": "./assets/fastmet/icon.png",
        "backgroundColor": "#ffffff",
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.guildsman.fastmet",
      "googleServicesFile": "./google-services.json",
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/fastmet/icon.png",
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/fastmet/splash.png",
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "imageWidth": 200,
        },
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme":
            "com.googleusercontent.apps.657062346189-9uo7mfoih186nsrih5c6cr4q36uvpoe8",
        },
      ],
      "expo-font",
      "expo-web-browser",
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true,
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "177af201-fa0a-44b7-a20b-c22a01e455a7",
      },
      "apiUrl":
        process.env.NODE_ENV === "production"
          ? process.env.EXPO_PUBLIC_API_URL_PROD
          : process.env.EXPO_PUBLIC_API_URL_DEV,
    },
  },
};
