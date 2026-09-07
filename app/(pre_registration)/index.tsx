import React, {useState} from "react";
import {ActivityIndicator, StyleSheet, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {WebView} from "react-native-webview";

const URL = "https://www.fastmet.com.ph/app-view/user-register";

export default function UserPreRegistrationScreen() {
  const [loading, setLoading] = useState(true);
  const inset = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: inset.bottom,
        backgroundColor: "white",
      }}
    >
      {loading && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      <WebView
        source={{uri: URL}}
        style={{flex: 1}}
        injectedJavaScriptBeforeContentLoaded={`
          document.addEventListener('DOMContentLoaded', function() {
            document.body.style.paddingTop = '20px';
          });
          true;
        `}
        onLoadEnd={() => setLoading(false)}
        onShouldStartLoadWithRequest={(request) => request.url === URL}
        setSupportMultipleWindows={false}
        onOpenWindow={() => {}}
        originWhitelist={["https://*"]}
        onError={(syntheticEvent) => {
          console.log("WebView error:", syntheticEvent.nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          console.log("WebView HTTP error:", syntheticEvent.nativeEvent);
        }}
      />
    </View>
  );
}
