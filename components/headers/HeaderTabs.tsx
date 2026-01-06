import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

const HeaderTabs = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-8">
        <Pressable
          hitSlop={{ top: 20, left: 20, bottom: 0, right: 20 }}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons
            name="menu"
            size={Platform.OS === "ios" ? 34 : 28}
            color="#FFA840"
          />
        </Pressable>
        <View className="flex-row items-center gap-1">
          <Image
            source={require("@/assets/fastmet/logo.png")}
            style={{ width: 40, height: 60 }}
            contentFit="contain"
          />
          <Text className="text-lg font-bold tracking-widest text-white">
            FastMet
          </Text>
        </View>
      </View>
      <View>
        <Image
          source={require("@/assets/images/announcement.png")}
          style={{ width: 30, height: 30 }}
          contentFit="contain"
        />
      </View>
    </View>
  );
};

export default HeaderTabs;
