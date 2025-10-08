import {getUserProfile} from "@/api/user";
import {useProfileStore} from "@/store/useProfileStore";
import {onAuthStateChanged, User} from "firebase/auth";
import {useEffect, useState} from "react";
import {auth} from "../lib/firebaseConfig";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setProfile = useProfileStore((state) => state.setProfile);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const profile = await getUserProfile(firebaseUser.uid);
        if (profile.success && profile.user) setProfile(profile.user);
        setLoading(false); // only after profile fetched
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return {user, loading};
}
