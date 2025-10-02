import React, {FC} from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

const CustomKeyAvoidingView: FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1 /*dont know if this is needed*/}}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyAvoidingView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
