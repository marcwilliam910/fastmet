import React from "react";
import {Text, View} from "react-native";

const NotifViewer = () => {
  return (
    <View className="flex-1 p-4">
      <View className="gap-2">
        <Text className="self-end font-semibold text-gray-400">Yesterday</Text>
        <Text className="text-justify indent-10">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore,
          tenetur! Placeat pariatur sit, neque adipisci, ullam deleniti nemo
          soluta illum vero eligendi laboriosam, possimus velit eaque qui atque
          at ab. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui
          nostrum, voluptates voluptatibus vitae natus aut sapiente commodi ea
          cupiditate rerum quisquam est ipsam iusto tenetur, vel iste magnam
          impedit neque....
        </Text>
      </View>
    </View>
  );
};

export default NotifViewer;
