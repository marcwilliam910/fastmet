import { Type } from "@/store/slices/bookSlice";
import { useAppStore } from "@/store/useAppStore";
import { BookingTypeConfig, SubOption } from "@/types/bookingType";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const getMinTime = () => {
  const min = new Date();
  min.setHours(min.getHours() + 3);
  return min;
};

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export default function BookingTypeModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"main" | "calendar">("main");
  const [selectedDate, setSelectedDate] = useState(getMinTime());
  const [selectedTime, setSelectedTime] = useState(getMinTime());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoOption, setInfoOption] = useState<{
    name: string;
    description: string;
  } | null>(null);

  const bookingType = useAppStore((state) => state.bookingType);
  const setBookingType = useAppStore((state) => state.setBookingType);
  const bookingTypes = useAppStore((state) => state.bookingTypes);
  const bookingTypesLoading = useAppStore((state) => state.bookingTypesLoading);

  const resetCalendar = () => {
    setSelectedDate(getMinTime());
    setSelectedTime(getMinTime());
    setShowCalendar(false);
    setShowTimePicker(false);
  };

  const handleCancel = () => {
    resetCalendar();
    setStep("main");
    onClose();
  };

  const handleSelectType = (config: BookingTypeConfig) => {
    if (config.key === "schedule") {
      setStep("calendar");
      return;
    }

    if (config.subOptions.length > 0) {
      // Auto-select the first active sub-option so the type actually gets set
      const firstSub = config.subOptions
        .filter((s) => s.isActive)
        .sort((a, b) => a.order - b.order)[0];

      if (firstSub) {
        setBookingType({ type: config.key as Type, value: firstSub.key });
      }
      return;
    }

    // Flat types (pooling): confirm immediately
    setBookingType({
      type: config.key as Type,
      value: config.key.toUpperCase(),
    });
    onClose();
  };

  const handleSelectSubOption = (type: Type, subOption: SubOption) => {
    setBookingType({ type, value: subOption.key });
    onClose();
  };

  const handleConfirmSchedule = () => {
    let combined: Date;

    if (Platform.OS === "ios") {
      combined = selectedDate;
    } else {
      combined = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
      );
    }

    const minDateTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
    if (combined < minDateTime) {
      Toast.show({
        type: "info",
        text1: "Invalid schedule time",
        text2: "Pickup time must be at least 2 hours from now",
      });
      resetCalendar();
      return;
    }

    setBookingType({ type: "schedule", value: combined.toISOString() });
    resetCalendar();
    setStep("main");
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="items-center justify-center flex-1 bg-black/40">
        <View className="w-11/12 p-5 bg-white rounded-2xl">
          {/* ── MAIN STEP ── */}
          {step === "main" && (
            <>
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold">Booking Type</Text>
                <Pressable onPress={handleCancel} hitSlop={20}>
                  <Ionicons
                    name="close"
                    size={Platform.OS === "ios" ? 28 : 24}
                    color="black"
                  />
                </Pressable>
              </View>

              {bookingTypesLoading ? (
                <View className="py-8 items-center">
                  <ActivityIndicator color="#FFA840" />
                </View>
              ) : (
                <View className="gap-3">
                  {bookingTypes.map((config) => {
                    const isSelected = bookingType?.type === config.key;

                    return (
                      <View key={config.key}>
                        {/* Parent row */}
                        <Pressable
                          className={`flex-row items-center justify-between px-4 py-3 border rounded-lg ${
                            isSelected
                              ? "border-darkPrimary bg-orange-50"
                              : "border-gray-300"
                          }`}
                          onPress={() => handleSelectType(config)}
                        >
                          <View className="gap-0.5">
                            <View className="flex-row gap-2 items-center">
                              <Ionicons
                                name={
                                  config.icon as keyof typeof Ionicons.glyphMap
                                }
                                size={20}
                                color={isSelected ? "#FFA840" : "gray"}
                              />
                              <Text
                                className={`text-base font-medium ${isSelected ? "text-lightPrimary" : ""}`}
                              >
                                {config.name}
                              </Text>
                            </View>
                            {config.subtext && (
                              <Text className="text-xs text-gray-500 mt-0.5">
                                {config.subtext}
                              </Text>
                            )}
                          </View>
                          <Pressable
                            onPress={() => {
                              setInfoOption({
                                name: config.name,
                                description: config.description,
                              });
                              setInfoVisible(true);
                            }}
                            hitSlop={20}
                          >
                            <Ionicons
                              name="information-circle"
                              color="#FFA840"
                              size={Platform.OS === "ios" ? 25 : 22}
                            />
                          </Pressable>
                        </Pressable>

                        {/* Sub-options row — only when this type is selected and has sub-options */}
                        {isSelected && config.subOptions.length > 0 && (
                          <View className="mt-2 flex-row gap-2">
                            {config.subOptions
                              .filter((s) => s.isActive)
                              .sort((a, b) => a.order - b.order)
                              .map((subOption) => {
                                const isSubSelected =
                                  bookingType.value === subOption.key;
                                return (
                                  <Pressable
                                    key={subOption.key}
                                    className={`flex-1 px-1.5 py-2 border rounded-lg ${
                                      isSubSelected
                                        ? "border-darkPrimary bg-orange-50"
                                        : "border-gray-300 bg-white"
                                    }`}
                                    onPress={() =>
                                      handleSelectSubOption(
                                        config.key as Type,
                                        subOption,
                                      )
                                    }
                                  >
                                    <View className="flex-row items-center justify-center gap-1">
                                      <Ionicons
                                        name={
                                          subOption.icon as keyof typeof Ionicons.glyphMap
                                        }
                                        size={16}
                                        color={
                                          isSubSelected ? "#FFA840" : "gray"
                                        }
                                      />
                                      <Text
                                        className={`text-sm font-medium ${
                                          isSubSelected
                                            ? "text-lightPrimary"
                                            : "text-gray-600"
                                        }`}
                                      >
                                        {subOption.name}
                                      </Text>
                                      <Pressable
                                        hitSlop={12}
                                        onPress={() => {
                                          setInfoOption({
                                            name: subOption.name,
                                            description: subOption.description,
                                          });
                                          setInfoVisible(true);
                                        }}
                                      >
                                        <Ionicons
                                          name="information-circle-outline"
                                          color="#FFA840"
                                          size={14}
                                        />
                                      </Pressable>
                                    </View>
                                    {subOption.subtext && (
                                      <Text className="text-xs text-gray-500 text-center mt-1">
                                        {subOption.subtext}
                                      </Text>
                                    )}
                                  </Pressable>
                                );
                              })}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}

          {/* ── CALENDAR STEP ── */}
          {step === "calendar" && (
            <View className="gap-6">
              <View className="relative flex-row items-center justify-center">
                <Pressable
                  hitSlop={20}
                  className="absolute -top-1 left-1"
                  onPress={() => {
                    setStep("main");
                    resetCalendar();
                  }}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    color="#FFA840"
                    size={Platform.OS === "ios" ? 32 : 28}
                  />
                </Pressable>
                <Text className="text-lg font-bold">Max schedule: 1 month</Text>
              </View>

              {Platform.OS === "ios" ? (
                // iOS: single combined datetime picker
                <>
                  <View className="gap-1">
                    <Text className="ml-1 font-semibold text-lg">
                      Date & Time:
                    </Text>
                    <Pressable
                      onPress={() => setShowCalendar(true)}
                      className="items-center py-3 border border-gray-300 rounded-xl"
                    >
                      <Text className="text-base font-semibold text-gray-800">
                        {selectedDate.toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}{" "}
                        at{" "}
                        {selectedDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Pressable>
                  </View>

                  {showCalendar && (
                    <>
                      <DateTimePicker
                        value={selectedDate}
                        mode="datetime"
                        display="spinner"
                        onChange={(_, date) => {
                          if (date) setSelectedDate(date);
                        }}
                        minimumDate={
                          new Date(Date.now() + 2.5 * 60 * 60 * 1000)
                        }
                        maximumDate={
                          new Date(
                            new Date().setMonth(new Date().getMonth() + 1),
                          )
                        }
                        textColor="#000000"
                        themeVariant="light"
                      />
                      <Pressable
                        onPress={() => setShowCalendar(false)}
                        className="py-3 bg-lightPrimary rounded-xl"
                      >
                        <Text className="font-semibold text-center text-white">
                          Done
                        </Text>
                      </Pressable>
                    </>
                  )}

                  {!showCalendar && (
                    <Pressable
                      onPress={handleConfirmSchedule}
                      className="bg-lightPrimary rounded-xl"
                      style={{
                        paddingVertical: Platform.OS === "ios" ? 15 : 12,
                      }}
                    >
                      <Text className="font-semibold text-center text-white">
                        Confirm
                      </Text>
                    </Pressable>
                  )}
                </>
              ) : (
                // Android: separate date + time pickers
                <>
                  <View className="gap-1">
                    <Text className="ml-1 font-semibold text-lg">Date:</Text>
                    <Pressable
                      onPress={() => {
                        setShowCalendar(true);
                        setShowTimePicker(false);
                      }}
                      className="items-center py-3 border border-gray-300 rounded-xl"
                    >
                      <Text className="text-base font-semibold text-gray-800">
                        {selectedDate.toDateString()}
                      </Text>
                    </Pressable>
                  </View>

                  {showCalendar && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="calendar"
                      onChange={(_, date) => {
                        setShowCalendar(false);
                        if (date) {
                          setSelectedDate(date);
                          setShowTimePicker(true);
                        }
                      }}
                      minimumDate={new Date()}
                      maximumDate={
                        new Date(new Date().setMonth(new Date().getMonth() + 1))
                      }
                    />
                  )}

                  <View className="gap-1">
                    <Text className="ml-1 font-semibold text-lg">Time:</Text>
                    <Pressable
                      onPress={() => {
                        setShowCalendar(false);
                        setShowTimePicker(true);
                      }}
                      className="items-center py-3 border border-gray-300 rounded-xl"
                    >
                      <Text className="text-base font-semibold text-gray-800">
                        {selectedTime.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Pressable>
                  </View>

                  {showTimePicker && (
                    <DateTimePicker
                      value={selectedTime}
                      mode="time"
                      display="clock"
                      onChange={(_, time) => {
                        setShowTimePicker(false);
                        if (!time) return;

                        const selected = new Date(selectedDate);
                        selected.setHours(
                          time.getHours(),
                          time.getMinutes(),
                          0,
                          0,
                        );

                        if (isToday(selectedDate)) {
                          const minTime = getMinTime();
                          if (selected < minTime) {
                            Toast.show({
                              type: "info",
                              text1: "Invalid time",
                              text2:
                                "Pickup time must be at least 2 hours from now",
                            });
                            setSelectedTime(minTime);
                            return;
                          }
                        }

                        setSelectedTime(selected);
                      }}
                      is24Hour={false}
                    />
                  )}

                  {!showCalendar && !showTimePicker && (
                    <Pressable
                      onPress={handleConfirmSchedule}
                      className="py-3 bg-lightPrimary rounded-xl"
                    >
                      <Text className="font-semibold text-center text-white">
                        Confirm
                      </Text>
                    </Pressable>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </View>

      <BookingInfoModal
        visible={infoVisible}
        option={infoOption}
        onClose={() => setInfoVisible(false)}
      />
    </Modal>
  );
}

const BookingInfoModal = ({
  visible,
  onClose,
  option,
}: {
  visible: boolean;
  onClose: () => void;
  option: { name: string; description: string } | null;
}) => {
  if (!option) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-full rounded-2xl bg-white p-5">
          <Text className="text-xl font-semibold text-gray-900">
            {option.name}
          </Text>
          <Text className="mt-3 leading-6 text-gray-600">
            {option.description}
          </Text>
          <Pressable
            onPress={onClose}
            className="mt-5 self-end rounded-lg bg-[#FFA840] px-5 py-3"
            hitSlop={20}
          >
            <Text className="font-bold text-white">Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
