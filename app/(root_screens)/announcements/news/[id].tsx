import {useNews} from "@/queries/announcementQueries";
import {Image} from "expo-image";
import {router, useLocalSearchParams} from "expo-router";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import RenderHTML from "react-native-render-html";

export default function NewsDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();
  const {width} = useWindowDimensions();

  const {data: news, isLoading} = useNews(id!);

  if (isLoading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator />
      </View>
    );
  }

  if (!news) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-gray-400">News not found</Text>
      </View>
    );
  }

  const handleCtaPress = () => {
    if (news.cta?.url?.startsWith("/")) {
      router.push(news.cta.url);
    } else if (news.cta?.url) {
      Linking.openURL(news.cta.url);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{paddingBottom: news.cta?.url ? 100 : 24}}
      >
        <Image
          source={{uri: news.heroImage}}
          style={{width: "100%", height: 220}}
          contentFit="cover"
        />
        <View className="px-4 pt-4">
          <View className="flex-row items-center gap-2">
            <View className="px-2 py-0.5 rounded-full bg-orange-100">
              <Text className="text-xs font-medium text-orange-700">
                {news.tag}
              </Text>
            </View>
            <Text className="text-xs text-gray-400">
              {news.readTime} min read
            </Text>
          </View>
          <Text className="mt-2 text-xl font-bold text-gray-900">
            {news.title}
          </Text>

          <View className="mt-4">
            <RenderHTML
              contentWidth={width - 32}
              source={{html: news.content}}
            />
          </View>

          {news.cta?.title && (
            <View className="p-4 mt-6 bg-gray-50 rounded-xl">
              <Text className="font-semibold text-gray-900">
                {news.cta.title}
              </Text>
              {news.cta.description && (
                <Text className="mt-1 text-sm text-gray-500">
                  {news.cta.description}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {news.cta?.url && (
        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <Pressable
            className="items-center py-3 rounded-full bg-[#FFA840]"
            onPress={handleCtaPress}
          >
            <Text className="font-semibold text-white">
              {news.cta.label ?? "Learn more"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
