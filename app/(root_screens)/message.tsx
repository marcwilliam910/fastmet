import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import React, {useState} from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Message = () => {
  const [message, setMessage] = useState("");

  // Sample messages data
  const messages = [
    {id: "1", text: "Hello location po?", isSender: false, time: "10:30 AM"},
    {
      id: "2",
      text: "Address Location brgy 21",
      isSender: true,
      time: "10:31 AM",
    },
  ];

  const renderMessage = ({item}: any) => (
    <View
      className={`flex-row mb-3 ${item.isSender ? "justify-end" : "justify-start"}`}
    >
      {!item.isSender && (
        <View className="w-10 h-10 rounded-full bg-[#FFA840] items-center justify-center mr-2">
          <Ionicons name="person" size={20} color="white" />
        </View>
      )}

      <View
        className={`max-w-[70%] px-4 py-3 rounded-2xl ${
          item.isSender
            ? "bg-[#FFA840] rounded-br-none"
            : "bg-gray-200 rounded-bl-none"
        }`}
      >
        <Text
          className={`text-base ${item.isSender ? "text-white" : "text-gray-800"}`}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View className="bg-[#0F2535] px-4 py-3 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 gap-3">
            <Pressable>
              <Ionicons name="arrow-back" size={24} color="#FFA840" />
            </Pressable>

            <Image
              source={require("@/assets/images/icon.png")}
              style={{width: 40, height: 40, borderRadius: 999}}
              contentFit="contain"
            />

            <View className="flex-1">
              <Text className="text-base font-bold text-white">
                Driver's Name
              </Text>
              <View className="flex-row items-center gap-1">
                <View className="w-2 h-2 bg-green-500 rounded-full" />
                <Text className="text-sm text-green-400">Active</Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-4">
            <Pressable>
              <Ionicons name="call" size={24} color="#FFA840" />
            </Pressable>
            <Pressable>
              <Ionicons name="chatbubble-ellipses" size={24} color="#FFA840" />
            </Pressable>
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          className="flex-1 px-4 pt-4"
          contentContainerStyle={{paddingBottom: 20}}
        />

        {/* Input Section */}
        <View className="bg-[#0F2535] px-4 py-3 flex-row items-center gap-3">
          <Pressable>
            <Ionicons name="camera" size={28} color="#FFA840" />
          </Pressable>

          <Pressable>
            <Ionicons name="image" size={28} color="#FFA840" />
          </Pressable>

          <View className="flex-row items-center flex-1 px-4 py-0 bg-white rounded-full">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
              placeholderTextColor="#999"
              className="flex-1 text-base text-gray-800"
            />
            <Pressable>
              <Ionicons name="send" size={24} color="#FFA840" />
            </Pressable>
          </View>

          <Pressable>
            <Ionicons name="happy" size={28} color="#FFA840" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Message;
