import {auth} from "@/lib/firebase/firebaseConfig";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {GoogleAuthProvider, signInWithCredential, User} from "firebase/auth";

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
});

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

    const response = await GoogleSignin.signIn();

    // If user cancels, response may be undefined or missing data
    const idToken = response?.data?.idToken;
    if (!idToken) {
      console.warn("User cancelled or no ID token received");
      return null;
    }

    const googleCredential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, googleCredential);

    return result.user;
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);

    if (error.code === "SIGN_IN_CANCELLED") {
      return null; // silent cancel
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
