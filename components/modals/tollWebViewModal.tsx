// components/TollWebViewModal.jsx
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { ActivityIndicator, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

const TOLL_URL = "https://www.expressway.ph/toll-calculator";

export default function TollWebViewModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <Pressable
            onPress={() => {
              if (canGoBack) webViewRef.current?.goBack();
            }}
            className={`p-1 ${!canGoBack ? "opacity-30" : ""}`}
            disabled={!canGoBack}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>

          <Text className="text-sm font-semibold text-gray-800">
            PH Toll Fees
          </Text>

          <Pressable onPress={onClose} className="p-1">
            <Ionicons name="close" size={24} color="#000" />
          </Pressable>
        </View>

        {/* WebView */}
        <View className="flex-1">
          <WebView
            ref={webViewRef}
            source={{ uri: TOLL_URL }}
            javaScriptEnabled
            domStorageEnabled
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
          />
          {loading && (
            <View className="absolute inset-0 items-center justify-center bg-white">
              <ActivityIndicator size="large" color="#F97316" />
              <Text className="mt-2 text-sm text-gray-500">
                Loading toll rates...
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
