// Carousel.tsx
import {Image} from "expo-image";
import React, {useEffect, useRef, useState} from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const {width: SCREEN_WIDTH} = Dimensions.get("window");

// const carouselData = [
//   {
//     id: 1,
//     image: require("@/assets/vehicle/truck.png"),
//   },
//   {
//     id: 2,
//     image: require("@/assets/vehicle/car.png"),
//   },
//   {
//     id: 3,
//     image: require("@/assets/vehicle/motor.png"),
//   },
//   {
//     id: 4,
//     image: require("@/assets/vehicle/open_truck.png"),
//   },
//   {
//     id: 5,
//     image: require("@/assets/vehicle/suv.png"),
//   },
// ];

const carouselData = [
  {
    id: 1,
    image: require("@/assets/vehicle/truck.png"),
  },
  {
    id: 2,
    image: require("@/assets/vehicle/truck.png"),
  },
  {
    id: 3,
    image: require("@/assets/vehicle/truck.png"),
  },
];

// Define the image height - adjust this to match your needs
const IMAGE_HEIGHT = 180;

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => {
        const nextIndex = (current + 1) % carouselData.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * SCREEN_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  interface ScrollEvent {
    nativeEvent: {
      contentOffset: {
        x: number;
      };
    };
  }

  const handleScroll = (event: ScrollEvent): void => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
  };

  return (
    <View className="bg-[#d4e4f0]">
      {/* Fixed Slogan */}
      <View className="gap-2 pt-6">
        <Text className="text-3xl font-bold text-[#f59e0b] text-center">
          Company Slogan
        </Text>
      </View>

      {/* Carousel */}
      <View style={{height: IMAGE_HEIGHT}} className="relative">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
        >
          {carouselData.map((item) => (
            <View
              key={item.id}
              style={{width: SCREEN_WIDTH, height: IMAGE_HEIGHT}}
              className="items-center justify-center"
            >
              <Image
                source={item.image}
                style={{width: SCREEN_WIDTH * 0.9, height: IMAGE_HEIGHT}}
                contentFit="contain"
              />
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View className="absolute flex-row items-center self-center bottom-4">
          {carouselData.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => goToSlide(index)}
              className={`size-2.5 rounded-full mx-1.5 ${
                index === activeIndex ? "bg-[#f59e0b] size-3" : "bg-slate-400"
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
