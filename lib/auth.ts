import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {auth} from "./firebaseConfig";

export const signup = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = async (): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    const providerIds =
      currentUser?.providerData.map((p) => p.providerId) ?? [];

    if (providerIds.includes("google.com")) {
      await GoogleSignin.signOut();
    }

    // if (providerIds.includes("facebook.com")) {
    //   const fbToken = await AccessToken.getCurrentAccessToken();
    //   if (fbToken) {
    //     LoginManager.logOut();
    //   }
    // }

    await auth.signOut();
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};

export const updateDisplayName = async (displayName: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is signed in.");

  await updateProfile(user, {displayName});
};

export const forgotPassword = async (email: string) =>
  sendPasswordResetEmail(auth, email);
