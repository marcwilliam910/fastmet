import SearchConversationCard from "@/components/chat/SearchConversationCard";
import { useConversations, useConversationsByName } from "@/queries/conversation";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchChats = () => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const {
    data,
    isPending,
    error,
    refetch,
  } = useConversations(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 800);

    return () => clearTimeout(timer);
  }, [query]);


  // Hide status bar on focus
  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true);
      return () => {
        StatusBar.setHidden(false);
      };
    }, [])
  );

  const {
    data: searchData,
    isPending: isSearchPending,
    error: searchError,
  } = useConversationsByName(debouncedQuery);

  const conversation = useMemo(() => data?.pages.flatMap((page) => page.conversations) ?? [], [data]);
  const queryTrim = useMemo(
    () => query.trim().toLowerCase(),
    [query]
  );
  const localMatches = useMemo(() => {
    if (!queryTrim) return conversation;
    return conversation.filter((item) =>
      (item.driver.firstName + item.driver.lastName).toLowerCase().includes(queryTrim)
    );
  }, [conversation, queryTrim]);

  const combinedResults = useMemo(() => {
    if (!queryTrim) return localMatches;

    const seen = new Set(localMatches.map((item) => item._id));
    const serverMatches = (searchData?.conversations ?? []).filter(
      (item) => !seen.has(item._id)
    );

    return [...localMatches, ...serverMatches];
  }, [localMatches, queryTrim, searchData]);

  const shouldShowSearchLoading =
    debouncedQuery.length > 0 && isSearchPending;

  if (isPending)
    return (
      <View className="flex-1 items-center bg-white justify-center">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );

  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-semibold text-gray-500">
          {error.message}
        </Text>
        <Text className="text-sm text-gray-400" onPress={() => refetch()}>
          Tap to retry
        </Text>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 gap-4 py-6 bg-white">
      <View className="flex-row items-center px-2 gap-2">
        <Pressable
          onPress={() => router.back()}
          hitSlop={20}
        >
          <Ionicons name="chevron-back" size={Platform.OS === "ios" ? 32 : 28} color="#FFA840" />
        </Pressable>
        <View
          className="flex-row flex-1 items-center bg-ctaSecondary px-4 gap-2 rounded-full"
          style={{
            height: Platform.OS === "ios" ? 54 : 46,
          }}
        >
          <Ionicons
            name="search"
            size={Platform.OS === "ios" ? 24 : 20}
            color="#9FABB4"
          />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="#9FABB4"
            className="flex-1 text-base text-black leading-[18px]"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />

        </View>
      </View>

      {searchError ? (
        <View className="items-center px-4">
          <Text className="text-sm text-red-500">
            Failed to search conversations.
          </Text>
        </View>
      ) : null}

      <View className="flex-1">
        <FlatList
          data={combinedResults}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <SearchConversationCard item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ gap: 3, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled" // Add this

          ListEmptyComponent={() => {
            if (!queryTrim && conversation.length === 0) {
              return (
                <View className="items-center pt-10">
                  <Text className="text-base text-gray-400">
                    You have no conversations yet.
                  </Text>
                </View>
              );
            }

            if (queryTrim && !shouldShowSearchLoading) {
              return (
                <View className="items-center pt-10">
                  <Text className="text-base text-gray-400">
                    No matches for &quot;{query.trim()}&quot;.
                  </Text>
                </View>
              );
            }

            return null;
          }}
          ListFooterComponent={() => {
            if (shouldShowSearchLoading) {
              return (
                <View className="py-4">
                  <ActivityIndicator size="small" color="#FFA840" />
                </View>
              );
            }
            return null;
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchChats;
