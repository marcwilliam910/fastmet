import * as ImagePicker from "expo-image-picker";
import {Alert} from "react-native";

export const openGallery = async () => {
  const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (status !== "granted") {
    Alert.alert("Sorry, we need camera roll permissions!");
    return null;
  }

  return ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
};
