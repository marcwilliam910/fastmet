import {auth} from "@/lib/firebaseConfig";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {GoogleAuthProvider, signInWithCredential, User} from "firebase/auth";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
});

export const signInWithGoogle = async (): Promise<User> => {
  try {
    // Check if device supports Google Play services
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    // Get user info
    const response = await GoogleSignin.signIn();

    // Get the ID token from the response data
    const idToken = response.data?.idToken;

    if (!idToken) {
      throw new Error("No ID token received from Google");
    }

    // Create a Google credential with the token
    const googleCredential = GoogleAuthProvider.credential(idToken);

    // Sign-in with Firebase
    const result = await signInWithCredential(auth, googleCredential);

    return result.user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);

    if (error.code === "SIGN_IN_CANCELLED") {
      throw new Error("Sign in was cancelled");
    } else if (error.code === "IN_PROGRESS") {
      throw new Error("Sign in is already in progress");
    } else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
      throw new Error("Play services not available or outdated");
    }

    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const currentUser = GoogleSignin.getCurrentUser();
    return currentUser;
  } catch (error: any) {
    console.error("Get Current User Error:", error);
    return null;
  }
};

export const isSignedIn = async (): Promise<boolean> => {
  try {
    const currentUser = GoogleSignin.getCurrentUser();
    return currentUser !== null;
  } catch (error: any) {
    console.error("Check Sign In Status Error:", error);
    return false;
  }
};
