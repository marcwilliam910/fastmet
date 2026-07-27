import { useDocuments } from "@/queries/documentQueries";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import ImageView from "react-native-image-viewing";

export default function MyDocuments() {
  const { data, isLoading, isError, refetch } = useDocuments();

  const [viewerVisible, setViewerVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const images = useMemo(() => [{ uri: selectedImage }], [selectedImage]);

  const openViewer = (uri: string) => {
    if (!uri) return;

    setSelectedImage(uri);
    setViewerVisible(true);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-base text-gray-600">
          Failed to load documents.
        </Text>

        <Pressable
          onPress={() => refetch()}
          className="mt-4 rounded-xl bg-orange-500 px-5 py-3"
        >
          <Text className="font-semibold text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

  const isEmpty = !data.idImage && !data.selfieWithId; // data is narrowed here, no ?. needed

  if (isEmpty) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-base text-gray-600 text-center">
          You haven&apos;t uploaded any documents yet. Please upload your ID and
          a selfie with your ID to complete your profile.
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {}
        <View className=" p-4">
          <View className="flex-row flex-wrap justify-between">
            <Pressable
              onPress={() => openViewer(data.idImage)}
              className={`w-full mb-3`}
            >
              <View className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <Image
                  source={{ uri: data.idImage }}
                  contentFit="cover"
                  transition={200}
                  style={{ width: "100%", height: 130 }}
                  className=" bg-gray-100"
                />

                <View className="border-t border-gray-100 px-3 py-2">
                  <Text
                    className="text-center text-sm font-medium text-gray-700"
                    numberOfLines={1}
                  >
                    ID Image
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap justify-between">
            <Pressable
              onPress={() => openViewer(data.selfieWithId)}
              className={`w-full mb-3`}
            >
              <View className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <Image
                  source={{ uri: data.selfieWithId }}
                  contentFit="cover"
                  transition={200}
                  style={{ width: "100%", height: 130 }}
                  className=" bg-gray-100"
                />

                <View className="border-t border-gray-100 px-3 py-2">
                  <Text
                    className="text-center text-sm font-medium text-gray-700"
                    numberOfLines={1}
                  >
                    Selfie with ID
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <ImageView
        images={images}
        imageIndex={0}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </>
  );
}
