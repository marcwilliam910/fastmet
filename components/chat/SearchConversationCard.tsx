import { ConversationResponse } from "@/types/chat";
import { STATIC_IMAGES } from "@/utils/constants";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

const SearchConversationCard = ({ item }: { item: ConversationResponse }) => {
    return (
        <Pressable className="flex-row items-center gap-4 px-4 py-2 active:bg-ctaSecondary" onPress={() =>
            router.push({
                pathname: "/message",
                params: { conversationId: item._id },
            })
        }>
            <Image
                source={item.driver.profilePictureUrl
                    ? { uri: item.driver.profilePictureUrl }
                    : STATIC_IMAGES.userPlaceholder}
                style={{ width: 40, height: 40, borderRadius: 999 }} contentFit="cover" />
            <View className="flex-1 gap-1">
                <Text className="font-bold max-w-[60%]" numberOfLines={1}>{item.driver.firstName} {item.driver.lastName}</Text>
            </View>
        </Pressable>
    );
};

export default SearchConversationCard;