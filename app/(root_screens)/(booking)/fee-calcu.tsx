import React from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "./header";

const TollFeeCalculator = () => {
  return (
    <SafeAreaView className="flex-1 bg-white" style={{paddingBottom: 15}}>
      {/* Header */}
      <Header text="Toll Fee Calculator" />
    </SafeAreaView>
  );
};

export default TollFeeCalculator;
