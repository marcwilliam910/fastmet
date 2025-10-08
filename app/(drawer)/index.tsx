import {router} from "expo-router";
import {useEffect} from "react";

export default function DrawerIndexRedirect() {
  useEffect(() => {
    router.replace("/(drawer)/(tabs)");
  }, []);

  return null;
}
