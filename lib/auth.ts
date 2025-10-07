import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {auth} from "./firebaseConfig";

export const signup = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const login = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const updateDisplayName = async (displayName: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("No user is signed in.");

  await updateProfile(user, {displayName});
};

export const forgotPassword = async (email: string) =>
  sendPasswordResetEmail(auth, email);
