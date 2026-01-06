import React, { FC } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";

const CustomKeyAvoidingView: FC<{ children: React.ReactNode; ref?: any }> = ({
  children,
  ref,
}) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={ref}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 /*dont know if this is needed*/ }}
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
