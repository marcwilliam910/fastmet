import {Ionicons} from "@expo/vector-icons";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {Pressable, Text, View} from "react-native";

const HeaderDrawer = ({title}: {title: string}) => {
  const navigation = useNavigation();

  // Map titles to icons
  const iconMap: Record<string, string> = {
    "Home": "home",
    "My Profile": "person",
    "Settings": "settings",
    "About": "information-circle",
    "Apply as Driver": "car",
    "Favorite": "heart",
  };

  const iconName = iconMap[title] || "document-outline"; // fallback icon

  return (
    <View className="flex-row items-center justify-between w-full">
      {/* Left: Hamburger Menu */}
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="menu" size={28} color="#FFA840" />
      </Pressable>

      {/* Center: Icon + Title */}
      <View className="absolute left-0 right-0 flex-row items-center justify-center gap-2">
        <Ionicons
          name={iconName as keyof typeof Ionicons.glyphMap}
          size={24}
          color="#FFA840"
        />
        <Text className="text-lg font-bold text-white">{title}</Text>
      </View>

      {/* Right: Empty spacer to balance layout */}
      <View className="w-7" />
    </View>
  );
};

export default HeaderDrawer;
