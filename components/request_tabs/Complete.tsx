import useSeeMoreDetails from "@/hooks/useSeeMoreDetails";
import { Service } from "@/types/book";
import { serviceAddons } from "@/utils/constants";
import { formatDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import ImageView from "react-native-image-viewing";
import { SafeAreaView } from "react-native-safe-area-context";

const DUMMY_DATA = [
  {
    id: "1",
    driverName: "John Doe",
    rating: 4.5,
    vehicle: "Motorcycle",
    pickup: "13, Allen Street Village, San Isidro hagonoy Bulacan sfsd ddfg",
    dropoff: "Hernandez Street",
    distance: "3KM",
    isCash: true,
    amount: 100,
    selectedServices: serviceAddons,
    note: "Please handle with care.",
    images: [1, 2],
    driverPhotos: [1, 2],
    referenceNo: "FM-20230825-0001",
    acceptedTime: "Thu Nov 10 2025 13:49:00",
    completedTime: "Thu Nov 13 2025 13:59:49",
  },
];

export default function CompleteRoute() {
  const { modalVisible, setModalVisible, selectedRequest, handleSeeMorePress } =
    useSeeMoreDetails();
  const [customerRating, setCustomerRating] = useState(0);

  return (
    <>
      <FlatList
        data={DUMMY_DATA}
        renderItem={({ item }) => (
          <CompleteCard
            vehicle={item.vehicle}
            pickup={item.pickup}
            dropoff={item.dropoff}
            distance={item.distance}
            isCash={item.isCash}
            amount={item.amount}
            completedTime={item.completedTime}
            onPressSeeMore={() => handleSeeMorePress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4 bg-white"
        contentContainerStyle={{
          paddingBottom: 40,
          gap: 15,
        }}
      />
      <SeeMoreModal
        customerRating={customerRating}
        setCustomerRating={setCustomerRating}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        data={selectedRequest}
      />
    </>
  );
}

type CompleteCardProps = {
  vehicle: string;
  pickup: string;
  dropoff: string;
  distance: string;
  isCash: boolean;
  amount: number;
  completedTime: string;
  onPressSeeMore: () => void;
};

const CompleteCard = ({
  vehicle,
  completedTime,
  pickup,
  dropoff,
  distance,
  isCash,
  amount,
  onPressSeeMore,
}: CompleteCardProps) => {
  const formatted = new Date(completedTime).toLocaleString("en-US", {
    month: "short", // "Nov"
    day: "numeric", // "13"
    hour: "numeric", // "1"
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8, // for Android
      }}
      className="rounded-2xl"
    >
      <Pressable
        onPress={onPressSeeMore}
        className="overflow-hidden bg-white rounded-2xl active:opacity-80"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3 bg-lightPrimary">
          <Text className="text-lg font-semibold text-white">{vehicle}</Text>
          <Text className="text-sm text-white">Completed at {formatted}</Text>
        </View>

        {/* Body */}
        <View className="px-3 py-5">
          {/* Pickup & Drop */}
          <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed pl-7">
            <View className="gap-4">
              <Text
                className={`font-medium ${Platform.OS === "ios" ? "max-w-60" : "max-w-52"}`}
                numberOfLines={2}
              >
                {pickup}
              </Text>
              <Text
                className={`font-medium ${Platform.OS === "ios" ? "max-w-60" : "max-w-52"}`}
                numberOfLines={2}
              >
                {dropoff}
              </Text>
            </View>
            <Text className="font-bold">{distance}</Text>

            <Ionicons
              name="location-sharp"
              size={24}
              className="absolute -left-3.5 -top-1 bg-white"
            />
            <Ionicons
              name="locate-sharp"
              size={24}
              className="absolute -left-3.5 -bottom-1 bg-white"
            />
          </View>
          {/* Payment */}
          <View className="flex-row items-center justify-between p-4 mt-6 bg-gray-100 rounded-lg">
            <Text className="text-base text-gray-600">
              {isCash ? "Cash Payment" : "Online Payment"}
            </Text>
            <Text className="text-lg font-semibold text-darkPrimary">
              Php {amount.toLocaleString("en-US")}
            </Text>
          </View>
          <Pressable
            className="items-center justify-center mt-6 active:scale-105"
            onPress={onPressSeeMore}
          >
            <Text className="text-sm font-medium">+ See more</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};

function SeeMoreModal({
  visible,
  onClose,
  data,
  customerRating,
  setCustomerRating,
}: {
  visible: boolean;
  onClose: () => void;
  data: any;
  customerRating: number;
  setCustomerRating: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  if (!data) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-center px-4 pb-4">
          <Pressable onPress={onClose} className="absolute left-4 -top-1">
            <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
          </Pressable>
          <Text className="text-lg font-semibold capitalize">
            Completed Booking
          </Text>
        </View>

        {/* Content - Scrollable */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20, paddingBottom: 30 }}
        >
          <View className="p-5 rounded-2xl bg-lightPrimary">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="mb-1 text-sm text-white opacity-90">
                  Order Reference
                </Text>
                <Text className="text-xl font-bold text-white">
                  #{data.referenceNo}
                </Text>
              </View>
              <View className="items-end">
                <Text className="mb-1 text-sm text-white opacity-90">
                  Vehicle Type
                </Text>
                <Text className="text-lg font-semibold text-white">
                  {data.vehicle}
                </Text>
              </View>
            </View>
          </View>

          {/* Driver Info */}
          <View className="px-4 py-3">
            <Text className="mb-1 text-sm font-semibold text-gray-500">
              Driver
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="person-circle" size={44} color="#F7931E" />
                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {data.driverName}
                  </Text>
                  <View className="flex-row">
                    {[...Array(Math.floor(data.rating))].map((_, i) => (
                      <Ionicons key={i} name="star" size={18} color="#FFD700" />
                    ))}
                    {[...Array(5 - Math.floor(data.rating))].map((_, i) => (
                      <Ionicons
                        key={i}
                        name="star-outline"
                        size={18}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                </View>
              </View>

              <Pressable className="items-center active:scale-110">
                <Ionicons
                  name="chatbubble-ellipses"
                  size={26}
                  color="#F7931E"
                />
                <Text className="text-xs text-gray-600">Chat</Text>
              </Pressable>
            </View>
          </View>

          {/* Booking Timeline */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <Text className="mb-4 text-base font-semibold text-gray-800">
              Booking Timeline
            </Text>
            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">Accepted</Text>
                <Text className="text-sm font-semibold text-gray-800 ">
                  {formatDate(data.acceptedTime)}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">Completed</Text>
                <Text className="text-sm font-semibold text-gray-800">
                  {formatDate(data.completedTime)}
                </Text>
              </View>
            </View>
          </View>

          {/* Driver Uploaded Photos */}
          {data.driverPhotos && data.driverPhotos.length > 0 && (
            <View className="p-5 bg-gray-50 rounded-2xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="camera-outline" size={20} color="#F7931E" />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Driver Delivery Photos ({data.driverPhotos.length})
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {data.driverPhotos.map((img: any, index: number) => (
                  <View
                    key={index}
                    className="items-center justify-center bg-gray-200 rounded-xl"
                    style={{ width: 90, height: 90 }}
                  >
                    <Text className="text-gray-500">Photo {index + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Customer Rating Section */}
          <View className="p-4 bg-white rounded-xl">
            <Text className="mb-3 text-sm font-semibold text-gray-700">
              Rate this driver
            </Text>
            <View className="flex-row items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setCustomerRating(star)}
                  className="active:scale-110"
                >
                  <Ionicons
                    name={star <= customerRating ? "star" : "star-outline"}
                    size={36}
                    color={star <= customerRating ? "#FFD700" : "#D1D5DB"}
                  />
                </Pressable>
              ))}
            </View>
            {customerRating > 0 && (
              <Pressable className="p-3 mt-4 rounded-lg bg-lightPrimary active:bg-darkPrimary">
                <Text className="font-semibold text-center text-white">
                  Submit Rating
                </Text>
              </Pressable>
            )}
          </View>

          {/* Location Details */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <Text className="mb-4 text-base font-semibold text-gray-800">
              Trip Details
            </Text>

            <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed border-lightPrimary pl-7">
              <View className="gap-4">
                <Text className="text-sm font-medium">{data.pickup}</Text>
                <Text className="text-sm font-medium">{data.dropoff}</Text>
              </View>

              <Ionicons
                name="location-sharp"
                size={24}
                color={"#FFA840"}
                className="absolute -left-3.5 -top-1 bg-gray-50"
              />
              <Ionicons
                name="locate-sharp"
                size={24}
                color={"#FFA840"}
                className="absolute -left-3.5 -bottom-1 bg-gray-50 "
              />
            </View>
            {/* Distance */}
            <View className="flex-row items-center justify-between p-3 mt-4 bg-white rounded-lg">
              <Text className="text-sm text-gray-600">Distance</Text>
              <Text className="text-lg font-bold text-lightPrimary">
                {data.distance}
              </Text>
            </View>
          </View>

          {/* Payment Info */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <Text className="mb-3 text-base font-semibold text-gray-800">
              Payment Information
            </Text>
            <View className="flex-row items-center justify-between p-4 bg-white rounded-xl">
              <View className="flex-row items-center">
                <Ionicons
                  name={data.isCash ? "cash-outline" : "card-outline"}
                  size={22}
                  color="#666"
                />
                <Text className="ml-3 text-base text-gray-600">
                  {data.isCash ? "Cash Payment" : "Online Payment"}
                </Text>
              </View>
              <Text className="text-xl font-bold text-darkPrimary">
                Php {data.amount.toLocaleString("en-US")}
              </Text>
            </View>
          </View>

          {/* Selected Services */}
          {data.selectedServices && data.selectedServices.length > 0 && (
            <View className="p-5 bg-gray-50 rounded-2xl">
              <Text className="mb-3 text-base font-semibold text-gray-800">
                Selected Services ({data.selectedServices.length})
              </Text>
              <View className="gap-2">
                {data.selectedServices.map((service: Service) => (
                  <View
                    key={service.id}
                    className="flex-row items-center justify-between p-4 bg-white rounded-xl"
                  >
                    <View className="flex-row items-center flex-1">
                      <Text className="mr-3 text-2xl">{service.icon}</Text>
                      <Text className="text-base text-gray-800">
                        {service.name}
                      </Text>
                    </View>
                    <Text className="font-semibold text-lightPrimary">
                      ₱{service.price}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Item Type */}
          {data.itemType && (
            <View className="p-5 bg-blue-50 rounded-2xl">
              <View className="flex-row items-center mb-2">
                <Ionicons name="cube-outline" size={20} color="#3B82F6" />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Item Type
                </Text>
              </View>
              <Text className="leading-5 text-gray-700">{data.itemType}</Text>
            </View>
          )}

          {/* Note */}
          {data.note && (
            <View className="p-5 bg-amber-50 rounded-2xl">
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#FFA840"
                />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Note
                </Text>
              </View>
              <Text className="leading-5 text-gray-700">{data.note}</Text>
            </View>
          )}

          {/* Images */}
          {data.photos && data.photos.length > 0 && (
            <View className="p-5 bg-gray-50 rounded-2xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="image-outline" size={20} color="#666" />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Your Attached Images ({data.photos.length})
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {data.photos.map((img: any, index: number) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setImageViewerVisible(true);
                      setSelectedImageUrl(img);
                    }}
                    className="flex-1"
                  >
                    <Image
                      source={{ uri: img }}
                      style={{
                        flex: 1,
                        height: data.photos.length > 1 ? 100 : 200,
                      }}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      <ImageView
        images={[{ uri: selectedImageUrl }]}
        imageIndex={0}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />
    </Modal>
  );
}
