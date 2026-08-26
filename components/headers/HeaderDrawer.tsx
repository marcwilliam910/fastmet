import {Ionicons} from "@expo/vector-icons";
import {DrawerActions, useNavigation} from "@react-navigation/native";
import {Platform, Pressable, Text, View} from "react-native";

const HeaderDrawer = ({title}: {title: string}) => {
  const navigation = useNavigation();

  // Map titles to icons
  const iconMap: Record<string, string> = {
    Home: "home",
    Vouchers: "ticket",
    "My Profile": "person",
    Settings: "settings",
    About: "information-circle",
    "Customer Support": "headset",
  };

  const iconName = iconMap[title] || "document-outline"; // fallback icon

  return (
    <View className="flex-row items-center justify-center">
      {/* Left: Hamburger Menu */}
      <Pressable
        className="absolute top-0 left-0"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
      >
        <Ionicons
          name="menu"
          size={Platform.OS === "ios" ? 34 : 28}
          color="#FFA840"
        />
      </Pressable>

      {/* Center: Icon + Title */}
      <View className="w-full flex-row items-center justify-center gap-2">
        <Ionicons
          name={iconName as keyof typeof Ionicons.glyphMap}
          size={Platform.OS === "ios" ? 28 : 24}
          color="#FFA840"
        />
        <Text className="text-lg font-bold text-white">{title}</Text>
      </View>
    </View>
  );
};

export default HeaderDrawer;
