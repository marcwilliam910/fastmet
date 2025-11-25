import { openGallery } from "@/utils/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

const Message = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: 2,
      text: "Address Location brgy 21",
      createdAt: new Date(),
      user: {
        _id: 1,
        name: "Me",
      },
    },
    {
      _id: 1,
      text: "Hello location po?",
      createdAt: new Date(),
      user: {
        _id: 2,
        name: "Driver's Name",
        avatar: require("@/assets/images/user.png"),
      },
    },
  ]);
  const [text, setText] = useState("");

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    console.log(newMessages);
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await openGallery();
    if (result && !result.canceled && result.assets[0]) {
      const newMessage: IMessage = {
        _id: Math.random().toString(),
        text: "",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "Me",
        },
        image: result.assets[0].uri,
      };
      onSend([newMessage]);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera permissions!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: IMessage = {
        _id: Math.random().toString(),
        text: "",
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "Me",
        },
        image: result.assets[0].uri,
      };
      onSend([newMessage]);
    }
  };

  const renderInputToolbar = () => {
    return (
      <View className="px-2 py-3 border-t border-gray-700 bg-secondary">
        <View className="flex-row items-end gap-3">
          <View className="flex-row items-center gap-3 h-11">
            {/* Camera */}
            <Pressable onPress={takePhoto}>
              <Ionicons name="camera" size={28} color="#FFA840" />
            </Pressable>
            {/* Gallery */}
            <Pressable onPress={pickImage}>
              <Ionicons name="image" size={28} color="#FFA840" />
            </Pressable>
          </View>
          {/* Text input */}
          <View className="flex-1 px-2 bg-white rounded-2xl">
            <TextInput
              placeholder="Type a message..."
              value={text}
              onChangeText={setText}
              multiline
              style={{
                maxHeight: 120,
                textAlignVertical: "center", // keep text centered
              }}
            />
          </View>
          <View className="flex-row items-center gap-3 h-11">
            {/* Emoji */}
            <Pressable>
              <Ionicons name="happy" size={28} color="#FFA840" />
            </Pressable>
            {/* Send */}
            <Pressable
              onPress={() => {
                if (!text.trim()) return;
                onSend([
                  {
                    _id: Date.now(),
                    text,
                    createdAt: new Date(),
                    user: { _id: 1 },
                  },
                ]);
                setText("");
              }}
            >
              <Ionicons name="send" size={24} color="#FFA840" />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  // Custom Bubble
  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#FFA840",
          },
          left: {
            backgroundColor: "#E5E5E5",
          },
        }}
        textStyle={{
          right: {
            color: "white",
            fontSize: 15,
          },
          left: {
            color: "#1F2937",
            fontSize: 15,
          },
        }}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : keyboardVisible
              ? "height"
              : undefined
        }
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0} // Adjust this offset for iOS
      >
        {/* Custom Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-secondary">
          <View className="flex-row items-center flex-1 gap-5">
            <Pressable onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#FFA840" />
            </Pressable>

            <Image
              source={require("@/assets/images/user.png")}
              style={{ width: 40, height: 40, borderRadius: 999 }}
              contentFit="contain"
            />

            <View className="flex-1">
              <Text className="text-base font-bold text-white">
                Driver&apos;s Name
              </Text>
              <View className="flex-row items-center gap-1">
                <View className="w-2 h-2 bg-green-500 rounded-full" />
                <Text className="text-sm text-green-400">Active</Text>
              </View>
            </View>
          </View>

          <View className="flex-row gap-6">
            <Pressable>
              <Ionicons name="call" size={24} color="#FFA840" />
            </Pressable>
            <Pressable>
              <Ionicons name="videocam" size={24} color="#FFA840" />
            </Pressable>
          </View>
        </View>

        {/* Gifted Chat */}
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar} // custom toolbar
          renderSend={() => null} // disable GiftedChat's default send
          keyboardShouldPersistTaps="handled"
          isKeyboardInternallyHandled={false}
          listViewProps={
            {
              contentContainerStyle: {
                paddingTop: 10,
              },
            } as any
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Message;
